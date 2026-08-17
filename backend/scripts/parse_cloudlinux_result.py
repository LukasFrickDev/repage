import base64
import binascii
import json
import re
import sys


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit('CloudLinux result path is required.')

    try:
        with open(sys.argv[1], encoding='utf-8') as payload_file:
            payload = json.load(payload_file)
        if not isinstance(payload, dict):
            raise ValueError('selector payload was not an object')
        if payload.get('result') != 'success':
            raise ValueError('selector result was not success')
        encoded = payload['data']
        if not isinstance(encoded, str):
            raise ValueError('selector data was not a string')
        decoded = base64.b64decode(encoded, validate=True).decode('utf-8')
        first_line = decoded.splitlines()[0] if decoded.splitlines() else ''
        match = re.fullmatch(r'returncode:\s*(-?\d+)\s*', first_line)
        if match is None:
            raise ValueError('selector output has no valid returncode line')
        returncode = int(match.group(1))
        if returncode != 0:
            raise ValueError(f'management command returncode was {returncode}')
    except (KeyError, TypeError, ValueError, UnicodeDecodeError, binascii.Error) as exc:
        raise SystemExit(f'CloudLinux management result invalid or unsuccessful: {exc}') from exc

    print(f'CloudLinux management command succeeded (returncode={returncode}).')


if __name__ == '__main__':
    main()
