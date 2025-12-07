# TL SR Review Tool

A lightweight Flask-based tool to quickly generate SR daily updates. English UI, entry management, preview and one-click copy, and container-ready.

## Features
- Entry management: add, delete, move up/down, insert after selected item
- Two input panels: `Summary` and `Next Plan`
- Preview & Copy: real-time composed output with clipboard copy
- English UI: buttons and fixed options use English terminology
- Terminology unified: `CX` replaced with `Customer`
- Convenience: `Custom note` input clears automatically after adding an entry

## Project Structure
```
app/
  main.py            
  templates/
    index.html       
  static/
    app.js           
    styles.css       
Dockerfile           
requirements.txt     
```

## Local Development
Requirements: `Python 3.12+`

```bash
python3 app/main.py
# Visit http://127.0.0.1:5000/
```

## Containerization
Requirements: Docker (Docker Desktop recommended)

```bash
# Build image
docker build -t tl-sr-review:latest .

# Run container (gunicorn, default port 8000)
docker run --rm -p 8000:8000 tl-sr-review:latest
# Visit http://localhost:8000/
```

## Usage
- In `Summary` or `Next Plan`, select date and fixed content; optionally fill `Custom note`
- After clicking `Add Entry`, the `Custom note` input is cleared for rapid consecutive entries
- Click an item to select it; new entries will insert right after the selected one
- Manage items using `Move Up`, `Move Down`, and `Delete`
- Use `Preview & Copy` to view the final text and copy to clipboard

## License
If needed, add a `LICENSE` file to the repository.
