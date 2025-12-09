# TL SR Review Tool

Flask-based tool to compose SR daily updates fast and clean. Includes entry management, evaluation panel, save/load, and a prominent security notice.

## Version
- UI version: `v1.1.0` (shown in the header)

## Features
- Entry management: add, delete, move up/down, insert after selected item
- Panels: `Summary`, `TL Evaluation`, `Next Plan`, `Load Saved SR`
- Preview & Copy: real-time composed output with clipboard copy
- Save/Load: persist composed content per SR number using simple files
- Security notice banner: warns against storing sensitive information
- English UI: unified terminology; `Custom Note` placeholder

## Layout
- Row 1: `Summary` (left), `Preview & Copy` (right – spans 2 rows)
- Row 2: `TL Evaluation` (left, single-column width)
- Row 3: `Next Plan` (left), `Load Saved SR` (right)

## Preview Composition
- Section order: `Summary:` → `Evaluation:` → `Next Plan:`
- `TL Evaluation` lines only include date and content, e.g. `[2025-12-09] - Investigation pending`
- Use `Copy to Clipboard` to copy the composed text

## Project Structure
```
app/
  main.py
  templates/
    index.html
  static/
    app.js
    styles.css
data/                # saved SR contents (created at runtime)
Dockerfile
requirements.txt
README.md
```

## Local Development
Requirements: `Python 3.12+`

```bash
python3 app/main.py
# Visit http://127.0.0.1:5000/
```

## Save/Load API
- Save: `POST /save_sr`
  - Body: `{ "srNumber": "<SR-ID>", "content": "<text>" }`
  - Writes to `data/<SR-ID>.txt`
- Load: `GET /load_sr?sr=<SR-ID>`
  - Returns `{ "content": "..." }` or `404` if not found

## Containerization
Requirements: Docker (Docker Desktop recommended)

```bash
# Build image
docker build -t tl-sr-review:latest .

# Run container (gunicorn, default port 8000)
docker run --rm -p 8000:8000 tl-sr-review:latest
# Visit http://localhost:8000/
```

## Usage Tips
- In `Summary` / `Next Plan`, select date and fixed content; optionally fill `Custom Note`
- Click `Add Entry` to append; input clears automatically for rapid entry
- Click an item to select it; new entries insert after the selected one
- Use `Move Up`, `Move Down`, `Delete` to manage order and items
- `TL Evaluation` accepts free-form comments with date; they appear in Preview without the `Evaluation` prefix per line

## Security Notice
- Banner text: `NOTICE: Do NOT save any SENSITIVE INFORMATION (eg. Logs) here. You can copy and paste the output to a notepad and perfect it.`
- Do not paste logs or other sensitive content into the web app; instead copy the composed output and finalize externally.

## License
If needed, add a `LICENSE` file to the repository.
