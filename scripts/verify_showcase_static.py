"""Verify the production static-serving slice without loading model sessions.

This is an in-process ASGI check, not a live socket, browser, or full API test.
"""
import ast
import hashlib
import json
import re
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'frontend/react-app/dist'

def main():
    source = ast.parse((ROOT / 'src/app_v2.py').read_text(encoding='utf-8'))
    start = next(i for i, n in enumerate(source.body) if isinstance(n, ast.Assign)
                 and any(isinstance(t, ast.Name) and t.id == 'REACT_DIST_DIR' for t in n.targets))
    end = next(i for i, n in enumerate(source.body) if isinstance(n, ast.FunctionDef) and n.name == 'serve_favicon')
    namespace = {'os': __import__('os'), 'app': FastAPI(), 'FRONTEND_DIR': str(ROOT / 'frontend'),
                 'StaticFiles': StaticFiles, 'HTTPException': HTTPException,
                 'FileResponse': FileResponse, 'RedirectResponse': RedirectResponse}
    exec(compile(ast.Module(body=source.body[start:end + 1], type_ignores=[]), 'app_v2_static_slice', 'exec'), namespace)
    identity = json.loads((DIST / 'release.json').read_text(encoding='utf-8'))
    checks = []
    with TestClient(namespace['app']) as client:
        for path in ['/', '/flowsense', '/architecture']:
            r = client.get(path)
            assert r.status_code == 200 and r.content == (DIST / 'index.html').read_bytes(), path
            checks.append({'path': path, 'status': r.status_code, 'type': r.headers['content-type']})
        for asset in re.findall(r'(?:src|href)="(/assets/[^"?#]+)', (DIST / 'index.html').read_text(encoding='utf-8')):
            r = client.get(asset)
            assert r.status_code == 200 and r.content == (DIST / asset.lstrip('/')).read_bytes(), asset
            checks.append({'path': asset, 'status': 200, 'type': r.headers['content-type']})
        r = client.get('/release.json')
        assert r.status_code == 200 and r.headers['content-type'] == 'application/json'
        assert r.json() == identity and r.headers['cache-control'] == 'no-cache'
        checks.append({'path': '/release.json', 'status': 200, 'type': r.headers['content-type']})
        evidence = '/evidence/application-baseline-2026-10-29/'
        manifest = json.loads((ROOT / 'docs/application-baseline-2026-10-29/SOURCE_MANIFEST.json').read_text(encoding='utf-8'))
        for image in manifest['images']:
            r = client.get(evidence + image['bundled_name'])
            assert r.status_code == 200 and r.headers['content-type'] == 'image/jpeg'
            assert r.content[:3] == b'\xff\xd8\xff'
            assert hashlib.sha256(r.content).hexdigest() == image['sha256']
            checks.append({'path': evidence + image['bundled_name'], 'status': 200, 'type': 'image/jpeg', 'sha256_match': True})
        r = client.get(evidence + 'provenance.json')
        assert r.status_code == 200 and r.headers['content-type'] == 'application/json'
        assert r.json() == manifest
        assert r.content == (ROOT / 'docs/application-baseline-2026-10-29/SOURCE_MANIFEST.json').read_bytes()
        checks.append({'path': evidence + 'provenance.json', 'status': 200, 'type': 'application/json', 'exact_manifest_bytes': True})
        for path in ['/evidence/.env', evidence + 'missing.jpg', evidence + '%2e%2e/%2e%2e/.env',
                     evidence + '%2e%2e%2f%2e%2e%2findex.html', '/.git/config', '/src/app_v2.py', '/output/', '/data/private.csv']:
            assert client.get(path).status_code == 404, path
            checks.append({'path': path, 'status': 404})
    print(json.dumps({'status': 'PASS', 'scope': __doc__.strip(), 'checks': checks}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
