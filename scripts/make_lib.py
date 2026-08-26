import os

os.makedirs('lib', exist_ok=True)
os.makedirs('scripts', exist_ok=True)
os.makedirs('app/api/chat', exist_ok=True)
os.makedirs('app/api/recommend', exist_ok=True)
os.makedirs('app/api/standards/[id]', exist_ok=True)

print('Folders confirmed')
