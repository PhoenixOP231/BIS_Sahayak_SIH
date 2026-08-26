import sys, os
target = sys.argv[1]
if os.path.dirname(target):
    os.makedirs(os.path.dirname(target), exist_ok=True)
with open(target, 'w', encoding='utf-8') as f_out:
    f_out.write(sys.stdin.read())
print('Successfully wrote ' + target)
