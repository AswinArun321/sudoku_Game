# Premium Python Sudoku 🐍 🌓

A sophisticated Sudoku game with high-performance Python backend logic and a premium interactive frontend.

## Features
- **Smart Generator**: Backtracking-based puzzle generation in Python.
- **Premium Design**: Classic 3x3 grid with high-visibility Indigo & Amber palette.
- **Interactive UI**: Motion effects, pop-animations for input, and shake-animations for errors.
- **Theme Support**: Persistent Dark & Light modes.
- **Ambient Visuals**: Falling background number effects for deep aesthetic.

## Folder Structure
```text
Sudoku_game/
├── app.py              # Flask server & Routing
├── sudoku_logic.py     # Python Sudoku engine
├── static/             # Frontend assets
│   ├── css/            # Style definitions
│   └── js/             # Interactive logic
├── templates/          # HTML blueprints
└── requirements.txt    # Project dependencies
```

## How to Run
1. **Install requirements**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Start the server**:
   ```bash
   python app.py
   ```
3. **Play**:
   Open `http://localhost:5000` in your browser.
