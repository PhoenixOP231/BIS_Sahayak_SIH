import json, glob, os, math, re

def generate_emb(text, dims=768):
    vector = [0.0] * dims
    words = re.findall(r'[\w]+', text.lower(), re.UNICODE)
    for i, w in enumerate(words):
        h = hash(w) % dims
        vector[h] += 1.0 / math.sqrt(len(words) or 1)
        h2 = hash(w + str(i)) % dims
        vector[h2] += 0.5 / math.sqrt(len(words) or 1)
    norm = math.sqrt(sum(x*x for x in vector)) or 1.0
    return [round(x / norm, 6) for x in vector]

files = [f for f in glob.glob('data/standards/*.json') if not f.endswith('standards-index.json')]
all_chunks = []
all_standards = []

for f in files:
    with open(f, 'r', encoding='utf-8') as jf:
        doc = json.load(jf)
    all_standards.append(doc)
    doc_id = doc['id']
    is_num = doc['isNumber']
    title = doc['title']
    title_hi = doc.get('titleHi', '')
    scope = doc.get('scope', '')
    scope_hi = doc.get('scopeHi', '')
    category = doc.get('category', '')
    status = doc.get('status', '')
    
    # scope
    all_chunks.append({
        'id': doc_id + '-scope',
        'standardId': doc_id,
        'isNumber': is_num,
        'title': title,
        'titleHi': title_hi,
        'clauseNumber': 'Scope',
        'heading': is_num + ' ? Scope & Applicability',
        'content': is_num + ' (' + title + '): ' + scope,
        'contentHi': scope_hi,
        'category': category,
        'status': status,
        'embedding': generate_emb(is_num + ' ' + title + ' ' + title_hi + ' ' + scope + ' ' + scope_hi)
    })
    
    # clauses
    for i, c in enumerate(doc.get('clauses', [])):
        c_num = c.get('clauseNumber', '')
        c_title = c.get('title', '')
        c_content = c.get('content', '')
        c_content_hi = c.get('contentHi', '')
        all_chunks.append({
            'id': doc_id + '-c' + str(i+1),
            'standardId': doc_id,
            'isNumber': is_num,
            'title': title,
            'titleHi': title_hi,
            'clauseNumber': c_num,
            'heading': is_num + ' ' + c_num + ' ? ' + c_title,
            'content': is_num + ' ' + c_num + ' (' + c_title + '): ' + c_content,
            'contentHi': c_content_hi,
            'category': category,
            'status': status,
            'embedding': generate_emb(is_num + ' ' + c_title + ' ' + c_content + ' ' + c_content_hi)
        })

with open('data/standards/standards-index.json', 'w', encoding='utf-8') as out_idx:
    json.dump(all_standards, out_idx, ensure_ascii=False, indent=2)

with open('data/standards-vectors.json', 'w', encoding='utf-8') as out_vec:
    json.dump(all_chunks, out_vec, ensure_ascii=False, indent=2)

print(f'Successfully built clean UTF-8 standards-index.json ({len(all_standards)} docs) and standards-vectors.json ({len(all_chunks)} chunks)!')
