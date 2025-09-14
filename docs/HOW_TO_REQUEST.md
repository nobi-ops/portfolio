# How to Request a Photobook Update

Use this guide to quickly request the addition of a new Muscle Model Japan photobook.

## Option A: Create a GitHub Issue (recommended)

1. Go to the repository on GitHub and create a new issue using the template `Add Photobook (MMJ)`.
2. Fill in the following fields:
   - Image path or URL (e.g., `images/mmjNN.jpeg` or a downloadable URL)
   - JA: 電子版 URL, 紙媒体 URL
   - EN: kindle URL, paper URL
   - (Optional) ID (number) and Title
3. Submit the issue, then notify the assistant here by pasting the issue link.

What happens next: The assistant runs `tools/add_photobook.py` to insert the card at the top of the JA/EN photobook grids, commits, and pushes.

## Option B: Send details directly to the assistant (this chat)

Paste the following block filled in:

```
Image: /Users/nobuhiro/portfolio/images/mmjNN.jpeg
JA: Electronic https://amzn.to/xxxxx / Print https://amzn.to/yyyyy
EN: kindle https://a.co/zzzzz / paper https://a.co/wwwww
Title (optional): Muscle Model Japan NN
ID (optional): NN
```

The assistant will run the helper and push changes.

## (For reference) Local helper script

Script: `tools/add_photobook.py`

Example:

```
python3 tools/add_photobook.py \
  --image "/path/to/mmjNN.jpeg" \
  --ja-kindle "https://amzn.to/..." \
  --ja-paper  "https://amzn.to/..." \
  --en-kindle "https://a.co/..." \
  --en-paper  "https://a.co/..."
```

Notes:
- The script copies the image into `images/mmjNN.jpeg` and inserts a new card at the top of both pages.
- If `ID` is omitted, it is inferred from the image name `mmjNN` or set to the next number.
- If a card for `mmjNN` already exists, the script aborts to prevent duplicates.

