const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Создание полей ввода для каждого месяца
const monthlyInputs = document.getElementById('monthlyInputs');
months.forEach(month => {
    const label = document.createElement('label');
    label.textContent = `Введите доход за ${month}:`;
    label.className = 'block text-lg font-semibold mb-2';
    monthlyInputs.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = month;
    input.placeholder = 'Введите доход';
    input.className = 'w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring focus:ring-green-200';
    input.addEventListener('input', formatInput);
    monthlyInputs.appendChild(input);
});

/* Game styles */
const style = document.createElement('style');
style.textContent = `
/* Game container styles */
.game-container {
    max-width: 550px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border-radius: 1.2rem;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* Game header */
.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1.5rem;
    flex-wrap: wrap;
    color: #e0e0e0;
}

/* Score box */
.score-box {
    background: #2a2a4a;
    border-radius: 0.8rem;
    padding: 0.8rem 1.8rem;
    border: 2px solid #4a4a8a;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.score-box:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(74, 74, 138, 0.4);
}

.score-box span:first-child {
    color: #00ddeb;
    font-size: 1.1rem;
}

/* Game board */
.game-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.9rem;
    background: #0f0f23;
    border-radius: 1.2rem;
    padding: 1rem;
    border: 2px solid #4a4a8a;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    position: relative;
}

/* Match-3 specific styles */
#match3-board {
    grid-template-columns: repeat(8, 1fr);
}

.match3-cell {
    aspect-ratio: 1;
    border-radius: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    position: relative;
    overflow: hidden;
    background: #2a2a4a;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.match3-cell::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.match3-cell:hover::before {
    opacity: 1;
}

.match3-cell:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 221, 235, 0.4);
}

.match3-cell.selected {
    transform: scale(0.92);
    box-shadow: 0 0 0 4px #00ddeb, 0 5px 15px rgba(0, 221, 235, 0.5);
    z-index: 2;
}

.match3-cell.swap {
    animation: swap 0.3s ease;
}

.match3-cell.fall {
    animation: fall 0.4s ease forwards;
}

.match3-cell.pop {
    animation: pop 0.2s ease;
}

.match3-cell.new {
    animation: fadeIn 0.3s ease;
}

/* 2048 specific styles */
#2048-board {
    position: relative;
    background: #0f0f23;
    aspect-ratio: 1;
}

.tile {
    position: absolute;
    width: calc(25% - 0.9rem);
    height: calc(25% - 0.9rem);
    border-radius: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 800;
    transition: transform 0.2s ease, top 0.2s ease, left 0.2s ease;
    z-index: 1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tile.new {
    animation: appear 0.2s ease;
}

.tile.merged {
    animation: merge 0.2s ease;
}

.tile-2 { background: linear-gradient(135deg, #eee4da, #e8d9c5); color: #776e65; }
.tile-4 { background: linear-gradient(135deg, #ede0c8, #e7d6b0); color: #776e65; }
.tile-8 { background: linear-gradient(135deg, #f2b179, #eda767); color: #f9f6f2; }
.tile-16 { background: linear-gradient(135deg, #f59563, #f08950); color: #f9f6f2; }
.tile-32 { background: linear-gradient(135deg, #f67c5f, #f16e4c); color: #f9f6f2; }
.tile-64 { background: linear-gradient(135deg, #f65e3b, #f14e2a); color: #f9f6f2; }
.tile-128 { background: linear-gradient(135deg, #edcf72, #e8c560); color: #f9f6f2; font-size: 1.3rem; }
.tile-256 { background: linear-gradient(135deg, #edcc61, #e8c150); color: #f9f6f2; font-size: 1.3rem; }
.tile-512 { background: linear-gradient(135deg, #edc850, #e8c33e); color: #f9f6f2; font-size: 1.3rem; }
.tile-1024 { background: linear-gradient(135deg, #edc53f, #e8bf2e); color: #f9f6f2; font-size: 1.1rem; }
.tile-2048 { background: linear-gradient(135deg, #edc22e, #e8bc1d); color: #f9f6f2; font-size: 1.1rem; }

.tile:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.grid-cell {
    aspect-ratio: 1;
    border-radius: 0.6rem;
    background: rgba(238, 228, 218, 0.2);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
}

/* Button styles */
.btn.btn-secondary {
    background: linear-gradient(135deg, #00ddeb, #0099a8);
    color: #fff;
    border: none;
    padding: 0.8rem 1.8rem;
    border-radius: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    align-items: center;
}

.btn.btn-secondary:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 221, 235, 0.4);
}

.btn.btn-secondary:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 221, 235, 0.2);
}

/* Tab button styles */
.tab-button {
    background: #2a2a4a;
    color: #e0e0e0;
    transition: background 0.3s ease, transform 0.3s ease;
}

.tab-button:hover {
    background: #3a3a6a;
    transform: translateY(-2px);
}

.tab-button.active {
    background: linear-gradient(135deg, #00ddeb, #0099a8);
    color: #fff;
}

/* Animation keyframes */
@keyframes swap {
    0% { transform: translate(0, 0); }
    50% { transform: translateY(-10px); }
    100% { transform: translate(0, 0); }
}

@keyframes fall {
    0% { transform: translateY(-100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

@keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(0); }
}

@keyframes fadeIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes appear {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
}

@keyframes merge {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

/* Custom CSS variables */
:root {
    --dark-matter: #0f0f23;
    --event-horizon: #4a4a8a;
    --quantum: #00ddeb;
}
`;
document.head.appendChild(style);

// Match-3 Game
function initMatch3Game() {
    const board = document.getElementById('match3-board');
    const scoreElement = document.getElementById('match3-score');
    const restartButton = document.getElementById('match3-restart');
    
    let score = 0;
    let selectedCell = null;
    const gems = ['💎', '❤️', '🌀', '💵', '🪙', '🪬'];
    
    function createBoard() {
        board.innerHTML = '';
        score = 0;
        scoreElement.textContent = '0';
        selectedCell = null;
        
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            cell.className = 'match3-cell new';
            cell.textContent = gems[Math.floor(Math.random() * gems.length)];
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
            setTimeout(() => cell.classList.remove('new'), 300);
        }
    }
    
    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.dataset.index);
        
        if (selectedCell === null) {
            selectedCell = cellIndex;
            cell.classList.add('selected');
        } else if (selectedCell === cellIndex) {
            selectedCell = null;
            cell.classList.remove('selected');
        } else {
            const firstCell = board.children[selectedCell];
            const secondCell = cell;
            
            if (isAdjacent(selectedCell, cellIndex)) {
                firstCell.classList.add('swap');
                secondCell.classList.add('swap');
                
                const temp = firstCell.textContent;
                firstCell.textContent = secondCell.textContent;
                secondCell.textContent = temp;
                
                setTimeout(() => {
                    firstCell.classList.remove('swap');
                    secondCell.classList.remove('swap');
                    
                    const matches = checkMatches();
                    if (matches.length > 0) {
                        removeMatches(matches);
                        updateScore(matches.length * 10);
                    } else {
                        firstCell.classList.add('swap');
                        secondCell.classList.add('swap');
                        const temp = firstCell.textContent;
                        firstCell.textContent = secondCell.textContent;
                        secondCell.textContent = temp;
                        setTimeout(() => {
                            firstCell.classList.remove('swap');
                            secondCell.classList.remove('swap');
                        }, 300);
                    }
                    
                    firstCell.classList.remove('selected');
                    selectedCell = null;
                }, 300);
            } else {
                board.children[selectedCell].classList.remove('selected');
                selectedCell = cellIndex;
                cell.classList.add('selected');
            }
        }
    }
    
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 8);
        const col1 = index1 % 8;
        const row2 = Math.floor(index2 / 8);
        const col2 = index2 % 8;
        
        return (Math.abs(row1 - row2) === 1 && col1 === col2) || 
               (Math.abs(col1 - col2) === 1 && row1 === row2);
    }
    
    function checkMatches() {
        const matches = new Set();
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {
                const index = row * 8 + col;
                const gem = board.children[index].textContent;
                
                if (board.children[index + 1].textContent === gem && 
                    board.children[index + 2].textContent === gem) {
                    matches.add(index);
                    matches.add(index + 1);
                    matches.add(index + 2);
                }
            }
        }
        
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 6; row++) {
                const index = row * 8 + col;
                const gem = board.children[index].textContent;
                
                if (board.children[index + 8].textContent === gem && 
                    board.children[index + 16].textContent === gem) {
                    matches.add(index);
                    matches.add(index + 8);
                    matches.add(index + 16);
                }
            }
        }
        
        return Array.from(matches);
    }
    
    function removeMatches(matchIndexes) {
        matchIndexes.forEach(index => {
            const cell = board.children[index];
            cell.classList.add('pop');
            setTimeout(() => {
                cell.textContent = '';
                cell.classList.remove('pop');
            }, 200);
        });
        
        setTimeout(() => {
            for (let col = 0; col < 8; col++) {
                let emptySpaces = [];
                
                for (let row = 7; row >= 0; row--) {
                    const index = row * 8 + col;
                    if (board.children[index].textContent === '') {
                        emptySpaces.push(index);
                    } else if (emptySpaces.length > 0) {
                        const emptyIndex = emptySpaces.shift();
                        board.children[emptyIndex].classList.add('fall');
                        board.children[emptyIndex].textContent = board.children[index].textContent;
                        board.children[index].textContent = '';
                        emptySpaces.push(index);
                        setTimeout(() => board.children[emptyIndex].classList.remove('fall'), 400);
                    }
                }
                
                emptySpaces.forEach(index => {
                    const cell = board.children[index];
                    cell.classList.add('new');
                    cell.textContent = gems[Math.floor(Math.random() * gems.length)];
                    setTimeout(() => cell.classList.remove('new'), 300);
                });
            }
            
            setTimeout(() => {
                const newMatches = checkMatches();
                if (newMatches.length > 0) {
                    removeMatches(newMatches);
                    updateScore(newMatches.length * 10);
                }
            }, 400);
        }, 300);
    }
    
    function updateScore(points) {
        score += points;
        scoreElement.textContent = score;
    }
    
    restartButton.addEventListener('click', createBoard);
    createBoard();
}

// 2048 Game
function init2048Game() {
    const board = document.getElementById('2048-board');
    const scoreElement = document.getElementById('2048-score');
    const bestScoreElement = document.getElementById('2048-best');
    const restartButton = document.getElementById('2048-restart');
    
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('2048-best') || 0;
    bestScoreElement.textContent = bestScore;
    
    function createBoard() {
        board.innerHTML = '';
        grid = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        scoreElement.textContent = '0';
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                board.appendChild(cell);
            }
        }
        
        addRandomTile();
        addRandomTile();
        updateView();
    }
    
    function addRandomTile() {
        const emptyCells = [];
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    function updateView() {
        document.querySelectorAll('.tile').forEach(tile => tile.remove());
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${grid[row][col]}`;
                    tile.textContent = grid[row][col];
                    tile.style.top = `calc(${row * 25}% + 0.45rem)`;
                    tile.style.left = `calc(${col * 25}% + 0.45rem)`;
                    tile.dataset.row = row;
                    tile.dataset.col = col;
                    board.appendChild(tile);
                }
            }
        }
    }
    
    function moveTiles(direction) {
        let moved = false;
        const newGrid = JSON.parse(JSON.stringify(grid));
        const merges = [];
        
        if (direction === 'right') {
            for (let row = 0; row < 4; row++) {
                newGrid[row] = newGrid[row].reverse();
            }
        } else if (direction === 'up') {
            for (let row = 0; row < 4; row++) {
                for (let col = row + 1; col < 4; col++) {
                    [newGrid[row][col], newGrid[col][row]] = [newGrid[col][row], newGrid[row][col]];
                }
            }
        } else if (direction === 'down') {
            for (let row = 0; row < 4; row++) {
                for (let col = row + 1; col < 4; col++) {
                    [newGrid[row][col], newGrid[col][row]] = [newGrid[col][row], newGrid[row][col]];
                }
            }
            for (let row = 0; row < 4; row++) {
                newGrid[row] = newGrid[row].reverse();
            }
        }
        
        for (let row = 0; row < 4; row++) {
            let nums = newGrid[row].filter(num => num !== 0);
            
            for (let i = 0; i < nums.length - 1; i++) {
                if (nums[i] === nums[i + 1]) {
                    nums[i] *= 2;
                    merges.push({ row, col: i });
                    nums[i + 1] = 0;
                    score += nums[i];
                    moved = true;
                }
            }
            
            nums = nums.filter(num => num !== 0);
            
            while (nums.length < 4) {
                nums.push(0);
            }
            
            if (newGrid[row].toString() !== nums.toString()) {
                moved = true;
            }
            
            newGrid[row] = nums;
        }
        
        if (direction === 'right') {
            for (let row = 0; row < 4; row++) {
                newGrid[row] = newGrid[row].reverse();
            }
        } else if (direction === 'up') {
            for (let row = 0; row < 4; row++) {
                for (let col = row + 1; col < 4; col++) {
                    [newGrid[row][col], newGrid[col][row]] = [newGrid[col][row], newGrid[row][col]];
                }
            }
        } else if (direction === 'down') {
            for (let row = 0; row < 4; row++) {
                newGrid[row] = newGrid[row].reverse();
            }
            for (let row = 0; row < 4; row++) {
                for (let col = row + 1; col < 4; col++) {
                    [newGrid[row][col], newGrid[col][row]] = [newGrid[col][row], newGrid[row][col]];
                }
            }
        }
        
        if (moved) {
            grid = newGrid;
            addRandomTile();
            updateView();
            
            document.querySelectorAll('.tile').forEach(tile => {
                const row = parseInt(tile.dataset.row);
                const col = parseInt(tile.dataset.col);
                tile.classList.add('new');
                setTimeout(() => tile.classList.remove('new'), 200);
                
                merges.forEach(merge => {
                    if (merge.row === row && merge.col === col) {
                        tile.classList.add('merged');
                        setTimeout(() => tile.classList.remove('merged'), 200);
                    }
                });
            });
            
            scoreElement.textContent = score;
            
            if (score > bestScore) {
                bestScore = score;
                bestScoreElement.textContent = bestScore;
                localStorage.setItem('2048-best', bestScore);
            }
            
            checkGameOver();
        }
    }
    
    function checkGameOver() {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] === 0) {
                    return false;
                }
            }
        }
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (col < 3 && grid[row][col] === grid[row][col + 1]) {
                    return false;
                }
                if (row < 3 && grid[row][col] === grid[row + 1][col]) {
                    return false;
                }
            }
        }
        
        setTimeout(() => {
            alert(`Игра окончена! Ваш счёт: ${score}`);
        }, 100);
        
        return true;
    }
    
    document.addEventListener('keydown', (e) => {
        if (!board.querySelector('.tile')) return;
        
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
            
            switch (e.code) {
                case 'ArrowUp': moveTiles('up'); break;
                case 'ArrowDown': moveTiles('down'); break;
                case 'ArrowLeft': moveTiles('left'); break;
                case 'ArrowRight': moveTiles('right'); break;
            }
        }
    });
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    board.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    board.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) moveTiles('right');
            else moveTiles('left');
        } else {
            if (dy > 0) moveTiles('down');
            else moveTiles('up');
        }
        
        touchStartX = 0;
        touchStartY = 0;
    }, false);
    
    restartButton.addEventListener('click', createBoard);
    createBoard();
}

// Tab navigation
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.remove('hidden');
            
            if (tabId === 'match3' && !document.querySelector('.match3-cell')) {
                initMatch3Game();
            } else if (tabId === 'game2048' && !document.querySelector('.tile')) {
                init2048Game();
            }
        });
    });
    
    // Initialize first tab
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
});

// Функция для форматирования ввода с точками
function formatInput(event) {
    const input = event.target;
    let value = input.value.replace(/\./g, '');
    value = value.replace(/\D/g, '');
    if (value.length > 3) {
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    input.value = value;
}

// Функция для форматирования числа
function formatNumber(value) {
    return value ? parseFloat(value).toLocaleString('ru-RU').replace(/,/g, '.') : '0';
}

// Функция для очистки форматирования
function cleanNumber(value) {
    return value.replace(/\./g, '');
}

// Расчет НДС
function calculateVAT() {
    const currentYearIncome = parseFloat(cleanNumber(document.getElementById('currentYearIncome').value)) || 0;
    let cumulativeIncome = 0;
    let totalVAT = 0;
    let vatRate = 0.0;

    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = '';

    const results = [];

    months.forEach(month => {
        const monthlyIncome = parseFloat(cleanNumber(document.getElementById(month).value)) || 0;
        cumulativeIncome += monthlyIncome;

        if (cumulativeIncome > 250000000) {
            vatRate = 0.07;
        } else if (cumulativeIncome > 60000000 && vatRate === 0) {
            vatRate = 0.05;
        }

        const vatAmount = cumulativeIncome > 60000000 ? monthlyIncome * vatRate : 0;
        totalVAT += vatAmount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-3">${month}</td>
            <td class="p-3">${formatNumber(monthlyIncome)}</td>
            <td class="p-3">${formatNumber(cumulativeIncome)}</td>
            <td class="p-3">${vatRate > 0 ? `${(vatRate * 100).toFixed(2)}%` : 'без налога'}</td>
            <td class="p-3">${formatNumber(vatAmount.toFixed(2))}</td>
        `;
        tableBody.appendChild(row);

        results.push([
            month,
            monthlyIncome,
            cumulativeIncome,
            vatRate > 0 ? (vatRate * 100).toFixed(2) : 0,
            vatAmount.toFixed(2)
        ]);
    });

    document.getElementById('totalLabel').textContent = `Итого: ${formatNumber(cumulativeIncome)} ₽, Сумма НДС: ${formatNumber(totalVAT.toFixed(2))} ₽`;

    localStorage.setItem('vatResults', JSON.stringify(results));
    alert('Данные сохранены в локальное хранилище.');
}

// Очистка таблицы
function clearTable() {
    document.querySelector('#resultsTable tbody').innerHTML = '';
    document.getElementById('totalLabel').textContent = 'Итого: 0 ₽, Сумма НДС: 0 ₽';
    months.forEach(month => document.getElementById(month).value = '');
    document.getElementById('currentYearIncome').value = '';
}

// Сохранение в Excel
function saveToExcel() {
    const results = JSON.parse(localStorage.getItem('vatResults')) || [];
    if (results.length === 0) {
        alert('Нет данных для сохранения.');
        return;
    }

    const excelData = [
        ["месяц", "Доход в месяце", "Доход нарастающим итогом", "Ставка НДС", "Сумма НДС"]
    ];

    let cumulativeIncome = 0;
    let totalVAT = 0;

    results.forEach((row) => {
        const month = row[0];
        const monthlyIncome = parseFloat(cleanNumber(row[1].toString())) || 0;
        cumulativeIncome += monthlyIncome;

        let vatRate = 0;
        if (cumulativeIncome > 250000000) {
            vatRate = 7;
        } else if (cumulativeIncome > 60000000) {
            vatRate = 5;
        }

        const vatAmount = cumulativeIncome > 60000000 ? monthlyIncome * (vatRate / 100) : 0;
        totalVAT += vatAmount;

        excelData.push([month, monthlyIncome, cumulativeIncome, vatRate / 100, vatAmount.toFixed(2)]);
    });

    excelData.push(["", "", "", "НДС", totalVAT.toFixed(2)]);
    excelData.push(["", "", "", "УСН", ((cumulativeIncome - totalVAT) * 0.06).toFixed(2)]);
    excelData.push(["", "", "", "Итого налоги", (totalVAT + (cumulativeIncome - totalVAT) * 0.06).toFixed(2)]);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: 3 });
        if (worksheet[cellAddress]) {
            worksheet[cellAddress].z = '0%';
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Расчет НДС");
    XLSX.writeFile(workbook, "vat_results.xlsx");
}

// Импорт из Excel
function importFromExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);
            json.forEach((row, index) => {
                if (index < months.length) {
                    const month = months[index];
                    document.getElementById(month).value = formatNumber(row['Доход в месяце'] || 0);
                }
            });
            calculateVAT();
        };
        reader.readAsArrayBuffer(file);
    };
    input.click();
}

// Простой калькулятор НДС
function calculateSimpleVAT() {
    const direction = document.getElementById('vatDirection').value;
    const amount = parseFloat(cleanNumber(document.getElementById('vatAmount').value)) || 0;
    const rate = parseFloat(document.getElementById('vatRate').value) / 100;
    let result;
    if (direction === 'add') {
        const vat = amount * rate;
        const total = amount + vat;
        result = `
            Сумма без НДС: ${formatNumber(amount)} ₽<br>
            НДС (${rate * 100}%): ${formatNumber(vat)} ₽<br>
            Сумма с НДС: ${formatNumber(total)} ₽<br>
            КБК: 182 1 03 01000 01 1000 110
        `;
    } else {
        const total = amount;
        const base = amount / (1 + rate);
        const vat = amount - base;
        result = `
            Сумма с НДС: ${formatNumber(total)} ₽<br>
            НДС (${rate * 100}%): ${formatNumber(vat)} ₽<br>
            Сумма без НДС: ${formatNumber(base)} ₽<br>
            КБК: 182 1 03 01000 01 1000 110
        `;
    }
    document.getElementById('vatResult').innerHTML = result;
}

// Калькулятор страховых взносов
function calculateInsurance() {
    const type = document.getElementById('insuranceType').value;
    const amount = parseFloat(cleanNumber(document.getElementById('insuranceAmount').value)) || 0;
    const limit = 2759000; // Лимит для ПФР на 2025
    let pfrRate = type === 'standard' ? 0.22 : 0.06;
    let fssRate = type === 'standard' ? 0.029 : 0.015;
    let ffomsRate = type === 'standard' ? 0.051 : 0.001;
    let pfr = Math.min(amount, limit) * pfrRate;
    let fss = amount * fssRate;
    let ffoms = amount * ffomsRate;
    if (amount > limit) {
        pfr += (amount - limit) * 0.1; // 10% сверх лимита
    }
    const total = pfr + fss + ffoms;
    document.getElementById('insuranceResult').innerHTML = `
        ПФР: ${formatNumber(pfr.toFixed(2))} ₽ (КБК: 182 1 02 15010 06 1000 160)<br>
        ФСС: ${formatNumber(fss.toFixed(2))} ₽ (КБК: 182 1 02 15020 06 1000 160)<br>
        ФФОМС: ${formatNumber(ffoms.toFixed(2))} ₽ (КБК: 182 1 02 15030 08 1000 160)<br>
        Итого: ${formatNumber(total.toFixed(2))} ₽
    `;
}

// Калькулятор НДФЛ
function calculateNDFL() {
    const salary = parseFloat(cleanNumber(document.getElementById('salaryAmount').value)) || 0;
    const children = parseInt(document.getElementById('childrenCount').value) || 0;
    const otherDeductions = parseFloat(cleanNumber(document.getElementById('otherDeductions').value)) || 0;
    let deductions = otherDeductions;
    for (let i = 0; i < children; i++) {
        deductions += i < 1 ? 1400 : i < 2 ? 2800 : 6000;
    }
    const taxable = Math.max(0, salary - deductions);
    let tax = 0;
    if (taxable <= 2400000) {
        tax = taxable * 0.13;
    } else if (taxable <= 5000000) {
        tax = 2400000 * 0.13 + (taxable - 2400000) * 0.15;
    } else if (taxable <= 20000000) {
        tax = 2400000 * 0.13 + 2600000 * 0.15 + (taxable - 5000000) * 0.18;
    } else if (taxable <= 50000000) {
        tax = 2400000 * 0.13 + 2600000 * 0.15 + 15000000 * 0.18 + (taxable - 20000000) * 0.20;
    } else {
        tax = 2400000 * 0.13 + 2600000 * 0.15 + 15000000 * 0.18 + 30000000 * 0.20 + (taxable - 50000000) * 0.22;
    }
    const kbk = taxable <= 2400000 ? '182 1 01 02010 01 1000 110' :
                taxable <= 5000000 ? '182 1 01 02080 01 1000 110' :
                taxable <= 20000000 ? '182 1 01 02150 01 1000 110' :
                taxable <= 50000000 ? '182 1 01 02160 01 1000 110' : '182 1 01 02170 01 1000 110';
    document.getElementById('ndflResult').innerHTML = `
        Налогооблагаемая база: ${formatNumber(taxable)} ₽<br>
        НДФЛ: ${formatNumber(tax.toFixed(2))} ₽<br>
        КБК: ${kbk}
    `;
}

// Калькулятор амортизации
function calculateAmortization() {
    const cost = parseFloat(cleanNumber(document.getElementById('assetCost').value)) || 0;
    const spi = parseInt(document.getElementById('assetSPI').value) || 12;
    const method = document.getElementById('amortMethod').value;
    const group = parseInt(document.getElementById('amortGroup').value) || 1;
    let result;
    if (method === 'linear') {
        const monthly = cost / spi;
        result = `Ежемесячная амортизация: ${formatNumber(monthly.toFixed(2))} ₽`;
    } else {
        const rates = { 1: 0.143, 2: 0.088, 3: 0.056 };
        let balance = cost;
        let monthly = balance * rates[group];
        result = `Ежемесячная амортизация (1-й месяц): ${formatNumber(monthly.toFixed(2))} ₽<br>Остаточная стоимость: ${formatNumber((balance - monthly).toFixed(2))} ₽`;
    }
    document.getElementById('amortResult').innerHTML = result;
}

// Список основных валют
const popularCurrencies = ['USD', 'EUR', 'CNY', 'GBP', 'JPY', 'CHF', 'KZT', 'UAH', 'BYN'];

// Заполняем select-ы валютами при загрузке страницы
function initCurrencySelects() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    
    // Очищаем и добавляем RUB первым
    fromSelect.innerHTML = '<option value="RUB">RUB</option>';
    toSelect.innerHTML = '<option value="RUB">RUB</option>';
    
    // Добавляем популярные валюты
    popularCurrencies.forEach(currency => {
        fromSelect.innerHTML += `<option value="${currency}">${currency}</option>`;
        toSelect.innerHTML += `<option value="${currency}">${currency}</option>`;
    });
    
    // Устанавливаем разумные значения по умолчанию
    fromSelect.value = 'RUB';
    toSelect.value = 'USD';
}

// Функция для форматирования числа с разделителями тысяч
function formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Функция для очистки форматирования (удаления всех нецифровых символов)
function cleanNumber(value) {
    return value.replace(/\D/g, '');
}

// Основная функция конвертации валют
let currentRates = {
    'RUB': { value: 1, nominal: 1, name: 'Российский рубль' }
};

// Основная функция конвертации валют
async function convertCurrency() {
    const amount = parseFloat(cleanNumber(document.getElementById('currencyAmount').value)) || 0;
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    let date = document.getElementById('currencyDate').value;

    if (!amount) {
        showCurrencyError('Введите сумму для конвертации');
        return;
    }

    if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];
        document.getElementById('currencyDate').value = date;
    }

    try {
        document.getElementById('currencyResult').innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
                <p class="mt-2">Получаем актуальные курсы...</p>
            </div>
        `;

        await fetchCurrencyRates(date);

        if (!currentRates[from] && from !== 'RUB') {
            throw new Error(`Валюта "${from}" не найдена`);
        }
        if (!currentRates[to] && to !== 'RUB') {
            throw new Error(`Валюта "${to}" не найдена`);
        }

        let result;
        if (from === 'RUB') {
            const toRate = currentRates[to].value / currentRates[to].nominal;
            result = amount / toRate;
        } else if (to === 'RUB') {
            const fromRate = currentRates[from].value / currentRates[from].nominal;
            result = amount * fromRate;
        } else {
            const fromRate = currentRates[from].value / currentRates[from].nominal;
            const toRate = currentRates[to].value / currentRates[to].nominal;
            result = (amount * fromRate) / toRate;
        }

        showCurrencyResult(amount, from, result, to, date);

    } catch (error) {
        console.error('Ошибка конвертации:', error);
        showCurrencyError(error.message || 'Ошибка при конвертации. Попробуйте позже.');
    }
}

// Функция для получения курсов валют
async function fetchCurrencyRates(date) {
    const [year, month, day] = date.split('-');
    const cbrDate = `${day}/${month}/${year}`;
    
    try {
        // Вариант 1: Используем CORS-прокси
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://www.cbr.ru/scripts/XML_daily.asp?date_req=${cbrDate}`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        
        if (!response.ok) {
            throw new Error('Не удалось получить данные через прокси');
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        if (xmlDoc.getElementsByTagName("Valute").length === 0) {
            throw new Error('Нет данных о курсах валют');
        }

        currentRates = { 'RUB': { value: 1, nominal: 1, name: 'Российский рубль' } };

        for (let valute of xmlDoc.getElementsByTagName("Valute")) {
            const charCode = valute.getElementsByTagName("CharCode")[0].textContent;
            const value = parseFloat(valute.getElementsByTagName("Value")[0].textContent.replace(',', '.'));
            const nominal = parseInt(valute.getElementsByTagName("Nominal")[0].textContent);
            const name = valute.getElementsByTagName("Name")[0].textContent;
            
            currentRates[charCode] = { 
                value, 
                nominal, 
                name: name || charCode
            };    
        }

        updateRatesInfo(date);

    } catch (error) {
        console.error('Ошибка при получении курсов:', error);
        // Пробуем альтернативный источник
        await fetchAlternativeRates();
    }
}

// Альтернативный источник курсов валют
async function fetchAlternativeRates() {
    try {
        // Используем фиксированные курсы как резервный вариант
        const fixedRates = {
            'USD': { value: 78.50, nominal: 1, name: 'Доллар США' },
            'EUR': { value: 90.14, nominal: 1, name: 'Евро' },
            'GBP': { value: 105.40, nominal: 1, name: 'Фунт стерлингов' },
            'CNY': { value: 10.90, nominal: 1, name: 'Китайский юань' },
            'JPY': { value: 0.54, nominal: 100, name: 'Японская иена' }
        };

        currentRates = { 'RUB': { value: 1, nominal: 1, name: 'Российский рубль' } };
        
        for (const [currency, rate] of Object.entries(fixedRates)) {
            currentRates[currency] = rate;
        }

        updateRatesInfo(new Date().toISOString().split('T')[0]);
        document.getElementById('ratesInfo').innerHTML += '<br><span class="text-yellow-600">Использованы фиксированные курсы</span>';

    } catch (error) {
        console.error('Ошибка альтернативного источника:', error);
        throw new Error('Не удалось получить курсы валют');
    }
}

// Обновление информации о курсах на странице
function updateRatesInfo(date) {
    const usdRate = currentRates['USD'] ? (currentRates['USD'].value / currentRates['USD'].nominal).toFixed(4) : 'N/A';
    const eurRate = currentRates['EUR'] ? (currentRates['EUR'].value / currentRates['EUR'].nominal).toFixed(4) : 'N/A';
    
    document.getElementById('ratesInfo').innerHTML = `
        Курсы на ${date.split('-').reverse().join('.')}: 
        USD = ${usdRate} RUB, 
        EUR = ${eurRate} RUB
    `;
}

// Показать результат конвертации
function showCurrencyResult(amount, from, result, to, date) {
    const fromCurrency = currentRates[from]?.name || from;
    const toCurrency = currentRates[to]?.name || to;
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'bg-green-50 dark:bg-green-900/30 p-4 rounded-lg';
    
    const amountDiv = document.createElement('div');
    amountDiv.className = 'text-center text-2xl font-bold mb-2';
    amountDiv.textContent = `${formatNumber(amount.toFixed(2))} ${from} = ${formatNumber(result.toFixed(2))} ${to}`;
    resultDiv.appendChild(amountDiv);
    
    // Курс "из валюты"
    const fromRateDiv = document.createElement('div');
    fromRateDiv.className = 'bg-white dark:bg-gray-700 p-2 rounded';
    fromRateDiv.innerHTML = `
      <div class="font-semibold">1 ${from}</div>
      <div>= ${(from === 'RUB' 
        ? (1 / (currentRates[to]?.value / currentRates[to]?.nominal || 1)).toFixed(6) 
        : (currentRates[from]?.value / currentRates[from]?.nominal).toFixed(6)
      )} ${to === 'RUB' ? 'RUB' : to}</div>
    `;
    
    // Курс "в валюту"
    const toRateDiv = document.createElement('div');
    toRateDiv.className = 'bg-white dark:bg-gray-700 p-2 rounded';
    toRateDiv.innerHTML = `
      <div class="font-semibold">1 ${to}</div>
      <div>= ${(to === 'RUB' 
        ? (1 / (currentRates[from]?.value / currentRates[from]?.nominal || 1)).toFixed(6) 
        : (currentRates[to]?.value / currentRates[to]?.nominal).toFixed(6)
      )} ${from === 'RUB' ? 'RUB' : from}</div>
    `;
    
    const ratesContainer = document.createElement('div');
    ratesContainer.className = 'grid grid-cols-2 gap-4 mt-4 text-sm';
    ratesContainer.appendChild(fromRateDiv);
    ratesContainer.appendChild(toRateDiv);
    resultDiv.appendChild(ratesContainer);
    
    // Информация о валютах
    const infoDiv = document.createElement('div');
    infoDiv.className = 'mt-4 text-xs text-gray-500 dark:text-gray-400';
    resultDiv.appendChild(infoDiv);
    
    // Очищаем и добавляем результат
    const resultContainer = document.getElementById('currencyResult');
    resultContainer.innerHTML = '';
    resultContainer.appendChild(resultDiv);
}

// Показать ошибку
function showCurrencyError(message) {
    document.getElementById('currencyResult').innerHTML = `
        <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <div class="flex items-center text-red-600 dark:text-red-400">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
            <div class="mt-2 text-sm">
                Проверьте введенные данные и попробуйте снова.
            </div>
        </div>
    `;
}

// Обновить курсы валют
async function updateCurrencyRates() {
    const date = document.getElementById('currencyDate').value || new Date().toISOString().split('T')[0];
    try {
        document.getElementById('ratesInfo').innerHTML = `
            <i class="fas fa-spinner fa-spin text-blue-500"></i> Обновление курсов...
        `;
        await fetchCurrencyRates(date);
    } catch (error) {
        document.getElementById('ratesInfo').innerHTML = `
            <span class="text-red-500"><i class="fas fa-exclamation-circle"></i> Ошибка при обновлении курсов</span>
        `;
    }
}

// Форматирование числа с разделителями
function formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Очистка форматирования числа
function cleanNumber(value) {
    return value.replace(/\s/g, '').replace(',', '.');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('currencyDate').value = today;
    updateCurrencyRates();
});

// Проверка ИНН через API ФНС
async function checkContractor() {
    const inn = document.getElementById('innInput').value.replace(/\D/g, '');
    
    // Валидация ИНН
    if (!inn || (inn.length !== 10 && inn.length !== 12)) {
        document.getElementById('contractorResult').innerHTML = 'ИНН должен содержать 10 или 12 цифр';
        return;
    }

    document.getElementById('contractorResult').innerHTML = 'Запрашиваем данные...';

    try {
        const response = await fetch(`https://egrul.itsoft.ru/${inn}.json`);
        
        if (!response.ok) {
            throw new Error('Организация не найдена');
        }
        
        const data = await response.json();
        
        // Обрабатываем данные для ИП (индивидуальных предпринимателей)
        if (data['СвИП']) {
            displayIndividualEntrepreneur(data['СвИП']);
        } 
        // Обрабатываем данные для юридических лиц
        else if (data['СвЮЛ']) {
            displayLegalEntity(data['СвЮЛ']);
        } 
        // Если формат ответа не распознан
        else {
            throw new Error('Неизвестный формат данных');
        }
        
    } catch (error) {
        document.getElementById('contractorResult').innerHTML = `
            <div class="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
                <p>Ошибка: ${error.message}</p>
                <p class="mt-2">Попробуйте проверить вручную:</p>
                <a href="https://egrul.nalog.ru" 
                   target="_blank" 
                   class="text-blue-500 underline">
                    Сайт ФНС
                </a>
            </div>
        `;
    }
}

// Функция для отображения данных ИП
function displayIndividualEntrepreneur(data) {
    const ip = data['@attributes'];
    const person = data['СвФЛ']?.['@attributes'] || {};
    const name = data['СвФЛ']?.['ФИОРус']?.['@attributes'] || {};
    const address = data['СвРегОрг']?.['@attributes'] || {};
    const status = data['СвПрекращ']?.['СвСтатус']?.['@attributes'] || {};
    const activities = data['СвОКВЭД'] || {};
    const taxOffice = data['СвУчетНО']?.['СвНО']?.['@attributes'] || {};
    const email = data['СвАдрЭлПочты']?.['@attributes'] || {};
    
    let resultHtml = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                Индивидуальный предприниматель
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <h3 class="font-semibold text-lg mb-2">Основные данные</h3>
                    <p><strong>ФИО:</strong> ${name['Фамилия'] || '-'} ${name['Имя'] || '-'} ${name['Отчество'] || '-'}</p>
                    <p><strong>ИНН:</strong> ${ip['ИННФЛ'] || '-'}</p>
                    <p><strong>ОГРНИП:</strong> ${ip['ОГРНИП'] || '-'}</p>
                    <p><strong>Дата регистрации:</strong> ${formatDate(ip['ДатаОГРНИП'])}</p>
                    <p><strong>Пол:</strong> ${person['Пол'] === '1' ? 'Мужской' : person['Пол'] === '2' ? 'Женский' : '-'}</p>
                </div>
                
                <div>
                    <h3 class="font-semibold text-lg mb-2">Контактные данные</h3>
                    <p><strong>Email:</strong> ${email['E-mail'] || '-'}</p>
                    <p><strong>Налоговый орган:</strong> ${taxOffice['НаимНО'] || '-'}</p>
                    <p><strong>Код налогового органа:</strong> ${taxOffice['КодНО'] || '-'}</p>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Адрес регистрации</h3>
                <p>${address['АдрРО'] ? address['АдрРО'].replace(/,/g, ', ') : '-'}</p>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Статус</h3>
                <p class="${status['КодСтатус'] ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}">
                    ${status['НаимСтатус'] || 'Действующий ИП'}
                </p>
                ${status['ДатаПрекращ'] ? `<p><strong>Дата прекращения:</strong> ${formatDate(status['ДатаПрекращ'])}</p>` : ''}
            </div>
    `;
    
    // Добавляем информацию об ОКВЭД
    if (activities['СвОКВЭДОсн']) {
        resultHtml += `
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Основной вид деятельности</h3>
                <p><strong>${activities['СвОКВЭДОсн']['@attributes']['КодОКВЭД'] || '-'}:</strong> 
                   ${activities['СвОКВЭДОсн']['@attributes']['НаимОКВЭД'] || '-'}</p>
            </div>
        `;
    }
    
    // Добавляем дополнительные виды деятельности
    if (activities['СвОКВЭДДоп'] && activities['СвОКВЭДДоп'].length > 0) {
        resultHtml += `
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Дополнительные виды деятельности</h3>
                <ul class="list-disc pl-5">
        `;
        
        const additionalActivities = Array.isArray(activities['СвОКВЭДДоп']) 
            ? activities['СвОКВЭДДоп'] 
            : [activities['СвОКВЭДДоп']];
        
        additionalActivities.forEach(activity => {
            resultHtml += `
                <li><strong>${activity['@attributes']['КодОКВЭД'] || '-'}:</strong> 
                    ${activity['@attributes']['НаимОКВЭД'] || '-'}</li>
            `;
        });
        
        resultHtml += `</ul></div>`;
    }
    
    resultHtml += `</div>`;
    
    document.getElementById('contractorResult').innerHTML = resultHtml;
}

// Функция для отображения данных юридического лица
function displayLegalEntity(data) {
    const company = data['@attributes'] || {};
    const address = data['СвАдресЮЛ'] || {};
    const status = data['СвПрекрЮЛ'] || {};
    const activities = data['СвОКВЭД'] || {};
    const taxOffice = data['СвРегОрг']?.['@attributes'] || {};
    const management = data['СвРукОрг'] || {};
    
    let resultHtml = `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                Юридическое лицо
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <h3 class="font-semibold text-lg mb-2">Основные данные</h3>
                    <p><strong>Наименование:</strong> ${company['НаимЮЛПолн'] || '-'}</p>
                    <p><strong>ИНН:</strong> ${company['ИНН'] || '-'}</p>
                    <p><strong>ОГРН:</strong> ${company['ОГРН'] || '-'}</p>
                    <p><strong>КПП:</strong> ${company['КПП'] || '-'}</p>
                    <p><strong>Дата регистрации:</strong> ${formatDate(company['ДатаОГРН'])}</p>
                </div>
                
                <div>
                    <h3 class="font-semibold text-lg mb-2">Контактные данные</h3>
                    <p><strong>Налоговый орган:</strong> ${taxOffice['НаимНО'] || '-'}</p>
                    <p><strong>Код налогового органа:</strong> ${taxOffice['КодНО'] || '-'}</p>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Юридический адрес</h3>
                <p>${address['АдресРФ']?.['@attributes']?.['НаимАдр'] || '-'}</p>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Статус</h3>
                <p class="${status['@attributes'] ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}">
                    ${status['@attributes']?.['НаимПрекр'] || 'Действующее юридическое лицо'}
                </p>
                ${status['@attributes']?.['ДатаПрекр'] ? `<p><strong>Дата прекращения:</strong> ${formatDate(status['@attributes']['ДатаПрекр'])}</p>` : ''}
            </div>
    `;
    
    // Добавляем информацию о руководстве
    if (management['ГРНДата'] && management['СвФЛ']) {
        const manager = management['СвФЛ']['@attributes'] || {};
        resultHtml += `
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Руководство</h3>
                <p><strong>${manager['НаимДолжн'] || 'Руководитель'}:</strong> 
                   ${manager['Фамилия'] || '-'} ${manager['Имя'] || '-'} ${manager['Отчество'] || '-'}</p>
            </div>
        `;
    }
    
    // Добавляем информацию об ОКВЭД
    if (activities['СвОКВЭДОсн']) {
        resultHtml += `
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Основной вид деятельности</h3>
                <p><strong>${activities['СвОКВЭДОсн']['@attributes']['КодОКВЭД'] || '-'}:</strong> 
                   ${activities['СвОКВЭДОсн']['@attributes']['НаимОКВЭД'] || '-'}</p>
            </div>
        `;
    }
    
    // Добавляем дополнительные виды деятельности
    if (activities['СвОКВЭДДоп'] && activities['СвОКВЭДДоп'].length > 0) {
        resultHtml += `
            <div class="mb-6">
                <h3 class="font-semibold text-lg mb-2">Дополнительные виды деятельности</h3>
                <ul class="list-disc pl-5">
        `;
        
        const additionalActivities = Array.isArray(activities['СвОКВЭДДоп']) 
            ? activities['СвОКВЭДДоп'] 
            : [activities['СвОКВЭДДоп']];
        
        additionalActivities.forEach(activity => {
            resultHtml += `
                <li><strong>${activity['@attributes']['КодОКВЭД'] || '-'}:</strong> 
                    ${activity['@attributes']['НаимОКВЭД'] || '-'}</li>
            `;
        });
        
        resultHtml += `</ul></div>`;
    }
    
    resultHtml += `</div>`;
    
    document.getElementById('contractorResult').innerHTML = resultHtml;
}

// Вспомогательная функция для форматирования даты
function formatDate(dateString) {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

// Учёт операций
let operations = JSON.parse(localStorage.getItem('operations')) || [];
function addOperation() {
    const type = document.getElementById('operationType').value;
    const amount = parseFloat(cleanNumber(document.getElementById('operationAmount').value)) || 0;
    const date = document.getElementById('operationDate').value;
    operations.push({ type, amount, date });
    localStorage.setItem('operations', JSON.stringify(operations));
    updateChart();
    alert('Операция добавлена');
}

// График налоговой нагрузки
let chartInstance = null;
function updateChart() {
    const ctx = document.getElementById('taxChart').getContext('2d');
    const incomes = operations.filter(op => op.type === 'income').reduce((sum, op) => sum + op.amount, 0);
    const expenses = operations.filter(op => op.type === 'expense').reduce((sum, op) => sum + op.amount, 0);
    const vatResults = JSON.parse(localStorage.getItem('vatResults')) || [];
    const totalVAT = vatResults.reduce((sum, row) => sum + parseFloat(row[4] || 0), 0);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Доходы', 'Расходы', 'НДС'],
            datasets: [{
                data: [incomes, expenses, totalVAT],
                backgroundColor: ['#34c759', '#ff3b30', '#007aff'],
                borderColor: ['#2a9d4a', '#d63031', '#005bb5'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Налоговая нагрузка' }
            }
        }
    });
}

// Справочник КБК
const kbkData = [
    { type: 'Единый налоговый платеж', kbk: '182 0 10 61201 01 0000 510' },
    { type: 'Налог на сверхприбыль', kbk: '182 1 01 03000 01 1000 110' },
    { type: 'НДФЛ 13% (до 2.4M)', kbk: '182 1 01 02010 01 1000 110' },
    { type: 'НДФЛ 15% (2.4–5M)', kbk: '182 1 01 02080 01 1000 110' },
    { type: 'НДФЛ 18% (5–20M)', kbk: '182 1 01 02150 01 1000 110' },
    { type: 'НДФЛ 20% (20–50M)', kbk: '182 1 01 02160 01 1000 110' },
    { type: 'НДФЛ 22% (>50M)', kbk: '182 1 01 02170 01 1000 110' },
    { type: 'Страховые взносы (единый тариф)', kbk: '182 1 02 01000 01 1000 160' },
    { type: 'НДС (реализация в РФ)', kbk: '182 1 03 01000 01 1000 110' },
];
document.getElementById('kbkSearch').addEventListener('input', () => {
    const search = document.getElementById('kbkSearch').value.toLowerCase();
    const tableBody = document.querySelector('#kbkTable tbody');
    tableBody.innerHTML = '';
    kbkData.filter(row => row.type.toLowerCase().includes(search)).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="p-3">${row.type}</td><td class="p-3">${row.kbk}</td>`;
        tableBody.appendChild(tr);
    });
});

// Экспорт в 1С (заглушка)
function exportTo1C() {
    alert('Экспорт в 1С... (Требуется серверная часть для генерации XML для 1С)');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active', 'border-green-500'));
            button.classList.add('active', 'border-green-500');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            document.getElementById(button.dataset.tab).classList.remove('hidden');
        });
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        document.getElementById('themeToggle').textContent = document.body.classList.contains('dark') ? 'Светлая тема' : 'Тёмная тема';
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('themeToggle').textContent = 'Светлая тема';
    }

    updateChart();
    document.querySelector('#kbkSearch').dispatchEvent(new Event('input'));
});
