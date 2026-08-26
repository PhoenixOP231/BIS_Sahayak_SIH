import json, sys, os

if __name__ == '__main__':
    bundle_path = sys.argv[1]
    with open(bundle_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for fpath, content in data.items():
        os.makedirs(os.path.dirname(fpath), exist_ok=True)
        with open(fpath, 'w', encoding='utf-8') as out:
            out.write(content)
        print(f'Unpacked {fpath} ({len(content)} chars)')
