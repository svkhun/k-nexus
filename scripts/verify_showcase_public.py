"""Check the public release identity, routes and exact asset bytes with bounded HTTP requests."""
import argparse
import hashlib
import json
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'frontend/react-app/dist'

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default='https://k-nexus-showcase.onrender.com')
    parser.add_argument('--report', required=True)
    args = parser.parse_args()
    report = {'started_at_utc': datetime.now(timezone.utc).isoformat(), 'url': args.url,
              'scope': 'Public HTTP and exact bytes only; no browser/layout/DOM/console claim', 'checks': []}
    local_bytes = (DIST / 'release.json').read_bytes()
    local = json.loads(local_bytes)
    report['expected_release_id'] = local['release_id']
    report['expected_source_sha256'] = local['source_sha256']
    def get(path):
        req = urllib.request.Request(args.url.rstrip('/') + path, headers={'Cache-Control': 'no-cache', 'User-Agent': 'K-NEXUS-release-verification/1'})
        with urllib.request.urlopen(req, timeout=35) as response:
            return response.status, response.headers.get_content_type(), response.read()
    try:
        # At most three attempts for a cold start or deployment propagation.
        for attempt in range(3):
            try:
                status, content_type, payload = get('/release.json?release=' + local['release_id'])
                assert status == 200 and content_type == 'application/json'
                assert payload == local_bytes, 'Public release identity differs from candidate'
                break
            except (OSError, AssertionError) as exc:
                report.setdefault('identity_attempts', []).append({'attempt': attempt + 1, 'error': str(exc)})
                if attempt == 2:
                    raise
                time.sleep(5)
        report['checks'].append({'path': '/release.json', 'status': status, 'content_type': content_type,
                                 'exact_bytes': True, 'sha256': hashlib.sha256(payload).hexdigest()})
        index_hash = local['files_sha256']['index.html']
        for path in ['/', '/flowsense', '/architecture']:
            status, content_type, payload = get(path)
            assert status == 200 and content_type == 'text/html'
            assert hashlib.sha256(payload).hexdigest() == index_hash, path
            report['checks'].append({'path': path, 'status': status, 'content_type': content_type, 'index_sha256_match': True})
        status, content_type, payload = get('/api/v2/health')
        health = json.loads(payload)
        assert status == 200 and content_type == 'application/json' and health['status'] == 'HEALTHY'
        report['checks'].append({'path': '/api/v2/health', 'status': status, 'content_type': content_type, 'health': health})
        for name, expected in local['files_sha256'].items():
            if not name.startswith(('assets/', 'evidence/')):
                continue
            path = '/' + name
            status, content_type, payload = get(path)
            assert status == 200 and hashlib.sha256(payload).hexdigest() == expected, path
            if name.endswith('.jpg'):
                assert content_type == 'image/jpeg' and payload[:3] == b'\xff\xd8\xff'
            if name.endswith('.json'):
                assert content_type == 'application/json'
                assert json.loads(payload) == json.loads((DIST / name).read_bytes())
            report['checks'].append({'path': path, 'status': status, 'content_type': content_type, 'sha256_match': True, 'sha256': expected})
        report['status'] = 'PASS_HTTP_IDENTITY_AND_ASSETS'
    except Exception as exc:
        report.update(status='FAIL_OR_BLOCKED', error_type=type(exc).__name__, error=str(exc))
    finally:
        report['finished_at_utc'] = datetime.now(timezone.utc).isoformat()
        Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(0 if report['status'].startswith('PASS') else 1)

if __name__ == '__main__':
    main()
