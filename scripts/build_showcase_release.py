"""Build the committed Showcase dist and write a non-self-referential identity."""
import argparse
import hashlib
import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / 'frontend/react-app'
DIST = FRONTEND / 'dist'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')

def inputs():
    paths = []
    for folder in [FRONTEND / 'src', FRONTEND / 'public']:
        paths.extend(p for p in folder.rglob('*') if p.is_file() and p.name != 'release.json')
    paths.extend(p for p in FRONTEND.iterdir() if p.is_file() and '.timestamp-' not in p.name)
    paths.extend([ROOT / '.gitattributes', ROOT / 'src/app_v2.py', ROOT / 'render.yaml', Path(__file__).resolve(),
                  ROOT / 'docs/application-baseline-2026-10-29/SOURCE_MANIFEST.json'])
    return {p.relative_to(ROOT).as_posix(): sha(p) for p in sorted(set(paths))}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-id', default='showcase-baseline-20261029.1')
    parser.add_argument('--verify-only', action='store_true')
    args = parser.parse_args()
    source_files = inputs()
    source_hash = hashlib.sha256(canonical(source_files)).hexdigest()
    if args.verify_only:
        identity = json.loads((DIST / 'release.json').read_text(encoding='utf-8'))
        assert identity['source_sha256'] == source_hash, 'Source identity changed'
        assert identity['source_files_sha256'] == source_files
        deployed_files = {p.relative_to(DIST).as_posix(): sha(p) for p in sorted(DIST.rglob('*'))
                          if p.is_file() and p.name != 'release.json'}
        assert identity['files_sha256'] == deployed_files, 'dist bytes or file set changed'
        print(json.dumps({'status': 'PASS', 'release_id': identity['release_id'],
                          'source_sha256': source_hash, 'dist_files_verified': len(deployed_files)}))
        return
    npm = 'npm.cmd' if os.name == 'nt' else 'npm'
    subprocess.run([npm, 'run', 'build'], cwd=FRONTEND, check=True)
    files = {p.relative_to(DIST).as_posix(): sha(p) for p in sorted(DIST.rglob('*'))
             if p.is_file() and p.name != 'release.json'}
    identity = {
        'release_id': args.release_id,
        'source_reference_commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
        'source_reference_note': 'Actual HEAD at build time; not a claim about the final deployed commit. Verify that separately in Render.',
        'source_sha256': source_hash,
        'source_hash_algorithm': 'SHA-256 of UTF-8 canonical JSON: sorted keys, no spaces, ensure_ascii=false',
        'source_files_sha256': source_files,
        'files_sha256': files,
        'identity_exclusions': ['release.json itself', 'Git metadata', 'release reports'],
        'scope': 'Showcase static content and local synthetic Application evidence only',
        'application_deployment_verified': False,
        'flowsense_ml_enabled_in_local_application': False,
    }
    (DIST / 'release.json').write_bytes((json.dumps(identity, ensure_ascii=False, indent=2) + '\n').encode('utf-8'))
    print(json.dumps({'release_id': args.release_id, 'source_sha256': source_hash, 'dist_files': len(files)}))

if __name__ == '__main__':
    main()
