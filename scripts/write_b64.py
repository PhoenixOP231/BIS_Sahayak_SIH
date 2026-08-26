import sys, base64
if len(sys.argv) < 3:
    print('Usage: python write_b64.py <filepath> <base64_content>')
    sys.exit(1)
filepath = sys.argv[1]
b64_str = sys.argv[2]
content = base64.b64decode(b64_str).decode('utf-8')
with open(filepath, 'w', encoding='utf-8') as out:
    out.write(content)
print('Successfully wrote', filepath)
