// Minimax AI для крестиков-ноликов
// Алгоритм с настраиваемой сложностью

export type Player = 'X' | 'O' | null;
export type Board = Player[];
export type Difficulty = 1 | 2 | 3 | 4 | 5; // 1=легко, 5=невозможно

// Проверка победителя
export function checkWinner(board: Board): Player {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // ряды
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // колонки
    [0, 4, 8], [2, 4, 6], // диагонали
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Проверка на ничью
export function isDraw(board: Board): boolean {
  return !checkWinner(board) && board.every(cell => cell !== null);
}

// Проверка окончания игры
export function isGameOver(board: Board): boolean {
  return checkWinner(board) !== null || isDraw(board);
}

// Получить доступные ходы
export function getAvailableMoves(board: Board): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter(index => index !== -1);
}

// Minimax алгоритм
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiPlayer: Player,
  humanPlayer: Player
): number {
  const winner = checkWinner(board);

  if (winner === aiPlayer) return 10 - depth;
  if (winner === humanPlayer) return depth - 10;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = aiPlayer;
      const evaluation = minimax(newBoard, depth + 1, false, alpha, beta, aiPlayer, humanPlayer);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = humanPlayer;
      const evaluation = minimax(newBoard, depth + 1, true, alpha, beta, aiPlayer, humanPlayer);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Найти лучший ход с учётом сложности
export function findBestMove(board: Board, aiPlayer: Player = 'O', difficulty: Difficulty = 5): number {
  const humanPlayer: Player = aiPlayer === 'O' ? 'X' : 'O';
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) return -1;

  // Вероятность случайного хода зависит от сложности
  // 1 = 80% случайных, 2 = 60%, 3 = 40%, 4 = 20%, 5 = 0% (идеально)
  const randomChance = (5 - difficulty) * 0.2;
  
  if (Math.random() < randomChance) {
    // Случайный ход
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Оптимальный ход (Minimax)
  let bestMove = -1;
  let bestValue = -Infinity;

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = aiPlayer;
    const moveValue = minimax(newBoard, 0, false, -Infinity, Infinity, aiPlayer, humanPlayer);

    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }

  return bestMove;
}

// Результат игры
export type GameResult = 'win' | 'lose' | 'draw' | null;

export function getGameResult(board: Board, humanPlayer: Player = 'X'): GameResult {
  const winner = checkWinner(board);
  
  if (winner === humanPlayer) return 'win';
  if (winner !== null) return 'lose';
  if (isDraw(board)) return 'draw';
  
  return null;
}

// Названия уровней сложности
export const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  1: 'ЛЁГКИЙ',
  2: 'СРЕДНИЙ', 
  3: 'СЛОЖНЫЙ',
  4: 'ЭКСПЕРТ',
  5: 'МАШИНА',
};
