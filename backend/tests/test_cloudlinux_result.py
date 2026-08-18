import base64
import json
import subprocess
import sys
from pathlib import Path

import pytest


PARSER = Path(__file__).parents[1] / 'scripts' / 'parse_cloudlinux_result.py'


def selector_payload(decoded: str, *, result: str = 'success') -> str:
    encoded = base64.b64encode(decoded.encode('utf-8')).decode('ascii')
    return json.dumps({'data': encoded, 'result': result})


def run_parser(tmp_path: Path, payload: str) -> subprocess.CompletedProcess[str]:
    payload_path = tmp_path / 'selector-result.json'
    payload_path.write_text(payload, encoding='utf-8')
    return subprocess.run(
        [sys.executable, str(PARSER), str(payload_path)],
        capture_output=True,
        text=True,
        check=False,
    )


def test_parser_accepts_real_text_format_without_printing_output(tmp_path: Path) -> None:
    process = run_parser(
        tmp_path,
        selector_payload('returncode: 0\nstdout:\nok\nstderr:\n'),
    )

    assert process.returncode == 0
    assert process.stdout.strip() == 'CloudLinux management command succeeded (returncode=0).'
    assert 'ok' not in process.stdout


def test_parser_rejects_nonzero_real_text_returncode(tmp_path: Path) -> None:
    process = run_parser(
        tmp_path,
        selector_payload('returncode: 1\nstdout:\n\nstderr:\nmigration failed\n'),
    )

    assert process.returncode != 0
    assert 'migration failed' not in process.stdout


@pytest.mark.parametrize(
    'payload',
    [
        '{invalid json',
        selector_payload('returncode: 0\n', result='failure'),
        json.dumps({'data': 'not-base64', 'result': 'success'}),
        selector_payload('stdout:\nok\nstderr:\n'),
        selector_payload('returncode: zero\nstdout:\n\nstderr:\n'),
    ],
)
def test_parser_rejects_malformed_external_or_text_payloads(
    tmp_path: Path,
    payload: str,
) -> None:
    process = run_parser(tmp_path, payload)

    assert process.returncode != 0


def test_deploy_checks_parser_before_passenger_restart() -> None:
    deploy_script = (PARSER.parents[2] / '.github' / 'scripts' / 'deploy-production.sh').read_text(
        encoding='utf-8'
    )

    assert deploy_script.index('selector_report=') < deploy_script.index(
        'touch "$backend_path/tmp/restart.txt"'
    )
