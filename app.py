from flask import Flask, render_template, jsonify
from sudoku_logic import generate_sudoku

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new-game')
def new_game():
    from flask import request
    level = request.args.get('level', 'medium')
    
    # Map levels to numbers of empty cells
    difficulties = {
        'easy': 30,
        'medium': 45,
        'hard': 60
    }
    
    difficulty = difficulties.get(level, 45)
    puzzle = generate_sudoku(difficulty=difficulty)
    return jsonify(puzzle)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
