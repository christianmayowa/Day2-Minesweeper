
const BOARD_SIZE = 9
const NUM_MINES = 10

const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector(".subtext")

// BOARD SETUP
let board = createBoard(BOARD_SIZE, NUM_MINES)
let minesLeft = NUM_MINES
minesLeftText.innerHTML = `Mines Left: ${minesLeft}`

// DISPLAY ALL THE BLOCKS IN THE GAME
boardElement.style.setProperty("--size", BOARD_SIZE)
board.forEach(row => {
    row.forEach(cell => {
    boardElement.append(cell.element)
    cell.element.addEventListener("click", () => {
        revealCell(board, cell)
        checkGameEnd()
    })
    cell.element.addEventListener("contextmenu", e => {
        e.preventDefault()
        markCell(cell)
        updateMinesLeft()
        })
    })
})


// CREATE BOARD WITH MINES
function createBoard(size, numMines) {
    const board = []
    const minePositions = getMinePositions(size, numMines)

    for (let x = 0; x < size; x++) {
    const row = []
    for (let y = 0; y < size; y++) {
        const element = document.createElement("div")
        element.dataset.status = "hidden"

    const cell = {
        element,
        x,
        y,
        mine: minePositions.some(p => p.x === x && p.y === y),
        status: "hidden",
    }
        row.push(cell)
    }
    board.push(row)
    }

    return board
}

// PUT THE MINES IN RANDOM PLACES
function getMinePositions(size, numMines) {
    const positions = []

    while (positions.length < numMines) {
        const position = {
        x: randomNumber(size),
        y: randomNumber(size),
    }

        if (!positions.some(p => p.x === position.x && p.y === position.y)) {
        positions.push(position)
        }
    }

    return positions
    }

    function randomNumber(size) {
    return Math.floor(Math.random() * size)
    }

    // REVEAL CELLS
    function revealCell(board, cell) {
    if (cell.status !== "hidden") return

    // CATCH IF LOSS
    if (cell.mine) {
        cell.element.dataset.status = "mine";
        // window.location.reload
        alert("YOU BOMB 💣: Game Over!")
        console.log(minesLeft)
        return
    }

    cell.status = "number"
    const adjMines = nearbyMines(board, cell)

    if (adjMines === 0) {
        cell.element.textContent = ""
        getAdjacentCells(board, cell).forEach(adj => revealCell(board, adj))
    } else {
        cell.element.textContent = adjMines
    }

    cell.element.dataset.status = "number"
    }

  // COUNT THE MINES AROUND THE CELL
    function nearbyMines(board, { x, y }) {
        return getAdjacentCells(board, { x, y }).filter(c => c.mine).length
    }

  // COUNT ADJACENT CELLS
    function getAdjacentCells(board, { x, y }) {
    const cells = []

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < board.length && ny >= 0 && ny < board.length) {
            if (dx !== 0 || dy !== 0) {
            cells.push(board[nx][ny])
            }
        }
    }
    }

    return cells
    }

  // FLAG CELLS (fLAG)
    function markCell(cell) {
    if (cell.status === "hidden") {
    cell.status = "marked"
    cell.element.dataset.status = "marked"
    } else if (cell.status === "marked") {
        cell.status = "hidden"
        cell.element.dataset.status = "hidden"
        }
    }

  // UPDATE COUNTER
    function updateMinesLeft() {
    const markedCount = board.reduce(
        (count, row) =>
        count + row.filter(cell => cell.status === "marked").length,
        0
    )
    minesLeftText.textContent = `Mines Left: ${NUM_MINES - markedCount}`
    }

  // CHECK WIN
    function checkGameEnd() {
    const win = board.every(row =>
        row.every(cell =>
        (cell.mine && cell.status !== "number") ||
        (!cell.mine && cell.status === "number")
        )
    )

    if (win) {
        alert("You Win!")
        }
    }