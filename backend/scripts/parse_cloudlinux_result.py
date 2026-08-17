import base64
import json
import sys


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit('CloudLinux result path is required.')

    try:
        with open(sys.argv[1], encoding='utf-8') as payload_file:
            payload = json.load(payload_file)
        if payload.get('result') != 'success':
            raise ValueError('selector result was not success')
        decoded = base64.b64decode(payload['data'], validate=True).decode('utf-8')
        result = json.loads(decoded)
        returncode = int(result['returncode'])
        if returncode != 0:
            raise ValueError(f'management command returncode was {returncode}')
    except (KeyError, TypeError, ValueError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise SystemExit(f'CloudLinux management result invalid or unsuccessful: {exc}') from exc

    print(f'CloudLinux management command succeeded (returncode={returncode}).')


if __name__ == '__main__':
    main()
