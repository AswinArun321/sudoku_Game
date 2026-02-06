import random

def is_valid(board, row, col, num):
    """Checks if placing a number in a given cell is valid."""
    # Check row
    for i in range(9):
        if board[row][i] == num:
            return False
    # Check column
    for i in range(9):
        if board[i][col] == num:
            return False
    # Check 3x3 box
    box_row, box_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(box_row, box_row + 3):
        for j in range(box_col, box_col + 3):
            if board[i][j] == num:
                return False
    return True

def solve(board):
    """Backtracking algorithm to solve Sudoku board."""
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                nums = list(range(1, 10))
                random.shuffle(nums)
                for num in nums:
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve(board):
                            return True
                        board[row][col] = 0
                return False
    return True

def generate_sudoku(difficulty=45):
    """Generates a new Sudoku puzzle by solving an empty board and removing numbers."""
    # Start with empty board
    board = [[0 for _ in range(9)] for _ in range(9)]
    # Solve it to get a full valid board
    solve(board)
    
    # Remove numbers to create a puzzle
    puzzle = [row[:] for row in board]
    attempts = difficulty
    
    while attempts > 0:
        row, col = random.randint(0, 8), random.randint(0, 8)
        if puzzle[row][col] != 0:
            puzzle[row][col] = 0
            attempts -= 1
            
    return puzzle
