#!/usr/bin/env python3
import argparse
import os
import re
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path('/Users/nobuhiro/portfolio')
JA_HTML = REPO_ROOT / 'index_ja.html'
EN_HTML = REPO_ROOT / 'index_en.html'
IMAGES_DIR = REPO_ROOT / 'images'


def read_text(p: Path) -> str:
    return p.read_text(encoding='utf-8')


def write_text(p: Path, s: str):
    p.write_text(s, encoding='utf-8')


def detect_existing_ids(html: str) -> list[int]:
    ids = [int(m.group(1)) for m in re.finditer(r'images/mmj(\d+)\.jpe?g', html, re.IGNORECASE)]
    return ids


def ensure_image(src_path: Path, mmj_id: int) -> Path:
    dest = IMAGES_DIR / f'mmj{mmj_id}.jpeg'
    if src_path.resolve() == dest.resolve():
        if not dest.exists():
            raise SystemExit(f'Image path given is the target but file does not exist: {dest}')
        return dest
    # copy/convert extension to .jpeg if needed
    if not src_path.exists():
        raise SystemExit(f'Image not found: {src_path}')
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src_path, dest)
    return dest


def insert_after_books_grid(html: str, block: str) -> str:
    # Insert block immediately after the first occurrence of <div class="books-grid">
    marker = '<div class="books-grid">'
    idx = html.find(marker)
    if idx == -1:
        raise SystemExit('Could not find books-grid container in HTML')
    insert_pos = html.find('\n', idx)
    if insert_pos == -1:
        insert_pos = idx + len(marker)
    # Keep same indentation as following lines
    indentation = ''
    # Compose insertion with newline
    insertion = f"\n{block.rstrip()}\n"
    return html[:insert_pos+1] + insertion + html[insert_pos+1:]


def build_block(mmj_id: int, title: str, img_rel: str, ja_kindle: str, ja_paper: str, en_kindle: str, en_paper: str):
    ja = f'''            <div class="book-item">
                <img src="{img_rel}" alt="{title}の表紙">
                <div class="book-info">
                    <h3>{title}</h3>
                    <div class="book-links">
                        <a href="{ja_kindle}" class="book-button" target="_blank" rel="noopener noreferrer">電子版</a>
                        <a href="{ja_paper}" class="book-button" target="_blank" rel="noopener noreferrer">紙媒体</a>
                    </div>
                </div>
            </div>'''
    en = f'''            <div class="book-item">
                <img src="{img_rel}" alt="{title} cover">
                <div class="book-info">
                    <h3>{title}</h3>
                    <div class="book-links">
                        <a href="{en_kindle}" class="book-button" target="_blank" rel="noopener noreferrer">kindle</a>
                        <a href="{en_paper}" class="book-button" target="_blank" rel="noopener noreferrer">paper</a>
                    </div>
                </div>
            </div>'''
    return ja, en


def infer_id_from_image_or_html(args_id: int | None, image_path: Path, ja_html: str, en_html: str) -> int:
    if args_id is not None:
        return args_id
    m = re.search(r'mmj(\d+)\.', image_path.name, re.IGNORECASE)
    if m:
        return int(m.group(1))
    existing = detect_existing_ids(ja_html + '\n' + en_html)
    return (max(existing) + 1) if existing else 1


def main():
    p = argparse.ArgumentParser(description='Add a new photobook card to JA/EN pages')
    p.add_argument('--id', type=int, help='Photobook numeric ID (e.g., 38)')
    p.add_argument('--image', required=True, help='Path to cover image (will be copied to images/mmj<ID>.jpeg if not already)')
    p.add_argument('--title', help='Title text; default: Muscle Model Japan <ID>')
    p.add_argument('--ja-kindle', required=True, help='JA page digital link')
    p.add_argument('--ja-paper', required=True, help='JA page print link')
    p.add_argument('--en-kindle', required=True, help='EN page kindle link')
    p.add_argument('--en-paper', required=True, help='EN page paper link')
    p.add_argument('--dry-run', action='store_true', help='Do not write files; just show intended changes')
    args = p.parse_args()

    ja_html = read_text(JA_HTML)
    en_html = read_text(EN_HTML)

    mmj_id = infer_id_from_image_or_html(args.id, Path(args.image), ja_html, en_html)
    title = args.title or f'Muscle Model Japan {mmj_id}'

    # Prevent duplicates
    existing_ids = set(detect_existing_ids(ja_html + '\n' + en_html))
    if mmj_id in existing_ids:
        print(f'Error: mmj{mmj_id} already present in pages. Aborting.', file=sys.stderr)
        sys.exit(2)

    # Ensure/copy image
    dest_image = ensure_image(Path(args.image), mmj_id)
    img_rel = f'images/mmj{mmj_id}.jpeg'

    ja_block, en_block = build_block(mmj_id, title, img_rel, args.ja_kindle, args.ja_paper, args.en_kindle, args.en_paper)

    new_ja = insert_after_books_grid(ja_html, ja_block)
    new_en = insert_after_books_grid(en_html, en_block)

    if args.dry_run:
        print('Would update JA and EN pages with the following blocks:\n')
        print('--- JA block ---')
        print(ja_block)
        print('\n--- EN block ---')
        print(en_block)
        print('\nImage at:', dest_image)
        return

    write_text(JA_HTML, new_ja)
    write_text(EN_HTML, new_en)
    print(f'Updated {JA_HTML} and {EN_HTML}')
    print(f'Image at: {dest_image}')


if __name__ == '__main__':
    main()

