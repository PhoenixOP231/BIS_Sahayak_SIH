import sys, base64

if __name__ == '__main__':
    target = sys.argv[1]
    b64_file = sys.argv[2]
    with open(b64_file, 'r', encoding='utf-8') as bf:
        b64_data = bf.read()
    raw = base64.b64decode(b64_data)
    with open(target, 'wb') as out:
        out.write(raw)
    print(f'Wrote {len(raw)} bytes to {target}')
