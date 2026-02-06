let puzzle = [];
let startTime;
let timerInterval;
let currentLevel = 'easy';
let gameActive = true;

async function fetchPuzzle() {
    try {
        const response = await fetch(`/new-game?level=${currentLevel}`);
        puzzle = await response.json();
        createGrid();
    } catch (error) {
        console.error('Error fetching puzzle:', error);
    }
}

function startGame(level) {
    currentLevel = level;
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    // Update active button UI in game-screen
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === level);
    });

    resetGame();
}

function showIntro() {
    clearInterval(timerInterval);
    document.getElementById('intro-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}

function setLevel(level) {
    if (currentLevel === level) return;
    currentLevel = level;
    // Update active button UI
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === level);
    });
    resetGame();
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('sudoku-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sudoku-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerText = theme === 'light' ? '🌙' : '☀️';
}

// Background Animation
function spawnFallingNumber() {
    const container = document.getElementById('bg-animation');
    if (!container) return;

    const num = document.createElement('div');
    num.className = 'falling-number';
    num.innerText = Math.floor(Math.random() * 9) + 1;

    const startX = Math.random() * 100;
    const duration = 5 + Math.random() * 10;
    const size = 1 + Math.random() * 3;
    const opacity = 0.05 + Math.random() * 0.15;

    num.style.left = `${startX}vw`;
    num.style.top = `-50px`;
    num.style.fontSize = `${size}rem`;
    num.style.opacity = opacity;
    num.style.animationDuration = `${duration}s`;

    container.appendChild(num);

    // Remove after animation completes
    setTimeout(() => {
        num.remove();
    }, duration * 1000);
}

function initBackground() {
    setInterval(spawnFallingNumber, 400);
    // Initial burst
    for (let i = 0; i < 15; i++) {
        setTimeout(spawnFallingNumber, Math.random() * 5000);
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const sec = String(elapsed % 60).padStart(2, '0');
        document.getElementById("timer").innerText = `Time: ${min}:${sec}`;
    }, 1000);
}

function createGrid() {
    const grid = document.getElementById("sudoku-grid");
    grid.innerHTML = "";

    puzzle.forEach((row, r) => {
        row.forEach((value, c) => {
            const input = document.createElement("input");
            input.type = "text";
            input.inputMode = "numeric";
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;
            input.classList.add("cell-fade-in");
            input.style.animationDelay = `${(r * 9 + c) * 5}ms`;

            if (value !== 0) {
                input.value = value;
                input.readOnly = true;
                input.classList.add("prefilled");
            }

            input.addEventListener("input", (e) => {
                const val = e.target.value;
                if (!/^[1-9]$/.test(val)) {
                    e.target.value = "";
                    return;
                }

                // Pop animation on input
                input.classList.remove("animate-pop");
                void input.offsetWidth; // Force reflow
                input.classList.add("animate-pop");

                validateCell(r, c, input);
            });

            input.addEventListener("focus", () => highlightRelated(r, c, input.value));
            input.addEventListener("blur", clearHighlights);

            grid.appendChild(input);
        });
    });

    startTimer();
}

function highlightRelated(row, col, value) {
    clearHighlights();
    const inputs = document.querySelectorAll("#sudoku-grid input");

    inputs.forEach((input, index) => {
        const r = Math.floor(index / 9);
        const c = index % 9;

        // Highlight Row, Column, and 3x3 Box
        const isSameRow = r === row;
        const isSameCol = c === col;
        const isSameBox = Math.floor(r / 3) === Math.floor(row / 3) &&
            Math.floor(c / 3) === Math.floor(col / 3);

        if (isSameRow || isSameCol || isSameBox) {
            input.classList.add("highlight-related");
        }

        // Highlight same values
        if (value && input.value === value) {
            input.classList.add("highlight-same-value");
        }
    });
}

function clearHighlights() {
    const inputs = document.querySelectorAll("#sudoku-grid input");
    inputs.forEach(input => {
        input.classList.remove("highlight-related", "highlight-same-value");
    });
}

function validateCell(row, col, cell) {
    if (!gameActive) return;
    cell.classList.remove("invalid");
    const value = cell.value;
    if (!value) return;

    const inputs = document.querySelectorAll("#sudoku-grid input");
    let isInvalid = false;

    // Row and Column check
    for (let i = 0; i < 9; i++) {
        if (i !== col && inputs[row * 9 + i].value === value) isInvalid = true;
        if (i !== row && inputs[i * 9 + col].value === value) isInvalid = true;
    }

    // Box check
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if ((r !== row || c !== col) && inputs[r * 9 + c].value === value) {
                isInvalid = true;
            }
        }
    }

    if (isInvalid) {
        cell.classList.add("invalid", "animate-shake");
        setTimeout(() => cell.classList.remove("animate-shake"), 200);
    }

    // Update same value highlights as user types
    highlightRelated(row, col, value);
}

function checkSolution() {
    const inputs = document.querySelectorAll("#sudoku-grid input");
    let complete = true;

    for (let cell of inputs) {
        if (cell.value === "") {
            complete = false;
            break;
        }
        if (cell.classList.contains("invalid")) {
            document.getElementById("message").style.color = "var(--invalid-text)";
            document.getElementById("message").innerText = "❌ Some entries are incorrect!";
            return;
        }
    }

    if (!complete) {
        document.getElementById("message").style.color = "var(--text-muted)";
        document.getElementById("message").innerText = "📝 Please fill all cells.";
        return;
    }

    clearInterval(timerInterval);
    document.getElementById("message").style.color = "#10b981";
    document.getElementById("message").innerText = "🎉 Congratulations! Sudoku solved!";
}

function resetGame() {
    clearInterval(timerInterval);
    gameActive = true;
    document.getElementById("message").innerText = "";
    document.getElementById("timer").innerText = "Time: 00:00";
    fetchPuzzle();
    initTheme();
    initBackground();
}

initTheme();
initBackground();
