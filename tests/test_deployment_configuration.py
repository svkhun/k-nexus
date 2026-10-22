"""Check deployment behavior without loading the unrelated ONNX models."""
import ast
import base64
import contextlib
import hashlib
import hmac
import io
import json
import os
from pathlib import Path
import secrets
import time
import unittest
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.testclient import TestClient


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "app_v2.py"
TREE = ast.parse(SOURCE.read_text(encoding="utf-8"))


def load_source_nodes(nodes, namespace):
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(SOURCE), "exec"), namespace)
    return namespace


class FrontendProbeTests(unittest.TestCase):
    def setUp(self):
        app = FastAPI()
        names = {"get_spa_or_landing_response", "serve_spa", "serve_simulator_page"}
        nodes = [node for node in TREE.body if isinstance(node, ast.FunctionDef) and node.name in names]
        load_source_nodes(nodes, {
            "app": app,
            "os": os,
            "FileResponse": FileResponse,
            "RedirectResponse": RedirectResponse,
            "FRONTEND_DIR": str(ROOT / "frontend"),
            "REACT_DIST_DIR": str(ROOT / "frontend" / "react-app" / "dist"),
        })
        self.client = TestClient(app)
        self.addCleanup(self.client.close)

    def test_head_probe_matches_get_headers_without_response_body(self):
        get = self.client.get("/")
        head = self.client.head("/")
        self.assertEqual(get.status_code, 200)
        self.assertEqual(head.status_code, 200)
        self.assertEqual(head.content, b"")
        self.assertEqual(head.headers["content-type"], get.headers["content-type"])
        self.assertEqual(head.headers["content-length"], str(len(get.content)))

    def test_head_support_does_not_allow_posting_to_homepage(self):
        self.assertEqual(self.client.post("/").status_code, 405)

    def test_evolution_supports_direct_navigation_to_the_showcase(self):
        response = self.client.get("/evolution")
        self.assertEqual(response.status_code, 200)
        self.assertIn('id="root"', response.text)

    def test_legacy_simulator_redirects_to_project_explanation(self):
        response = self.client.get("/simulator.html", follow_redirects=False)
        self.assertEqual(response.status_code, 307)
        self.assertEqual(response.headers["location"], "/evolution")


def boot_signing_engine(environment):
    nodes = [node for node in TREE.body if (
        isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == "_env_secret" for target in node.targets)
    ) or (
        isinstance(node, ast.If) and isinstance(node.test, ast.UnaryOp)
        and isinstance(node.test.operand, ast.Name) and node.test.operand.id == "_env_secret"
    ) or (
        isinstance(node, ast.FunctionDef) and node.name in {"generate_signed_micro_auth_token", "verify_signed_micro_auth_token"}
    )]
    namespace = dict(os=os, secrets=secrets, hmac=hmac, hashlib=hashlib, base64=base64, json=json, time=time)
    output = io.StringIO()
    with patch.dict(os.environ, environment, clear=True), contextlib.redirect_stdout(output):
        load_source_nodes(nodes, namespace)
    return namespace, output.getvalue()


class SigningConfigurationTests(unittest.TestCase):
    def test_configured_key_can_verify_a_token_after_process_restart(self):
        secret = secrets.token_hex(32)
        environment = {"RENDER": "true", "KBTG_JWT_SECRET": secret}
        first, first_log = boot_signing_engine(environment)
        second, second_log = boot_signing_engine(environment)
        token = first["generate_signed_micro_auth_token"]("ACC_0100", "ACC_0101", 350)
        verify = second["verify_signed_micro_auth_token"]
        self.assertTrue(verify(token, "ACC_0100", "ACC_0101", 350))
        self.assertFalse(verify(token, "ACC_0100", "ACC_0101", 351))
        self.assertNotIn("SecOps Alert", first_log + second_log)
        self.assertIn("loaded from KBTG_JWT_SECRET", first_log)
        self.assertNotIn(secret, first_log + second_log)

    def test_changing_key_rejects_the_previous_signature(self):
        first, _ = boot_signing_engine({"KBTG_JWT_SECRET": secrets.token_hex(32)})
        second, _ = boot_signing_engine({"KBTG_JWT_SECRET": secrets.token_hex(32)})
        token = first["generate_signed_micro_auth_token"]("ACC_0100", "ACC_0101", 350)
        self.assertFalse(second["verify_signed_micro_auth_token"](token, "ACC_0100", "ACC_0101", 350))

    def test_unconfigured_render_fallback_still_warns_without_logging_the_secret(self):
        first, output = boot_signing_engine({"RENDER": "true"})
        second, _ = boot_signing_engine({"RENDER": "true"})
        self.assertNotEqual(first["HMAC_SECRET"], second["HMAC_SECRET"])
        self.assertIn("without KBTG_JWT_SECRET", output)
        self.assertNotIn(first["HMAC_SECRET"], output)


if __name__ == "__main__":
    unittest.main()
