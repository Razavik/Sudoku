class Sudoku {
    constructor() {
        this.generateField();
        this.failRows = [];
        this.failCols = [];
        this.failBlocks = [];
    }

    generateField() {
        this.field = [];
        for (let i = 0; i < 9; i++) {
            this.field[i] = [];

            for (let j = 0; j < 9; j++) {
                this.field[i][j] = (i * 3 + Math.floor(i / 3) + j) % 9 + 1;
            }
        }

        this.shuffleField();
        this.endField = [...this.field.map(elem => [...elem])];
        this.generateStartField();
        this.resetField();

        document.getElementById('sudoku').style.backgroundColor = '';

        this.failBlocks = [];
    }

    generateStartField() {
        for (let removeCell = 0; removeCell < 70; removeCell++) {
            let x = parseInt(Math.random() * 9);
            let y = parseInt(Math.random() * 9);

            this.field[y][x] = 0;
        }

        this.startField = [...this.field.map(elem => [...elem])];
    }

    setEndField() {
        this.field = [...this.endField.map(elem => [...elem])];

        this.printField();

        this.checkFullField();
    }

    shuffleField() {
        do {
            this.shuffleRows();
            this.shuffleColumns();
            this.shuffleRowBlocks();
            this.shuffleColumnBlocks();
        } while (this.checkErrors(false) == true);
    }

    shuffleRows() {
        for (let block = 0; block < 9; block += 3) {
            for (let i = 0; i < 3; i++) {
                let row1 = Math.floor(Math.random() * 3) + block;
                let row2 = Math.floor(Math.random() * 3) + block;

                this.swapRows(row1, row2);
            }
        }
    }

    shuffleColumns() {
        for (let block = 0; block < 9; block += 3) {
            for (let i = 0; i < 3; i++) {
                let col1 = Math.floor(Math.random() * 3) + block;
                let col2 = Math.floor(Math.random() * 3) + block;

                this.swapColumns(col1, col2);
            }
        }
    }

    shuffleRowBlocks() {
        for (let i = 0; i < 3; i++) {
            let block1 = Math.floor(Math.random() * 3) * 3;
            let block2 = Math.floor(Math.random() * 3) * 3;

            this.swapRowBlocks(block1, block2);
        }
    }

    shuffleColumnBlocks() {
        for (let i = 0; i < 3; i++) {
            let block1 = Math.floor(Math.random() * 3) * 3;
            let block2 = Math.floor(Math.random() * 3) * 3;

            this.swapColumnBlocks(block1, block2);
        }
    }

    swapRows(row1, row2) {
        let temp = this.field[row1];
        this.field[row1] = this.field[row2];
        this.field[row2] = temp;
    }

    swapColumns(col1, col2) {
        for (let i = 0; i < 9; i++) {
            let temp = this.field[i][col1];
            this.field[i][col1] = this.field[i][col2];
            this.field[i][col2] = temp;
        }
    }

    swapRowBlocks(block1, block2) {
        for (let i = 0; i < 3; i++) {
            this.swapRows(block1 + i, block2 + i);
        }
    }

    swapColumnBlocks(field, block1, block2) {
        for (let i = 0; i < 3; i++) {
            this.swapColumns(field, block1 + i, block2 + i);
        }
    }

    resetField() {
        this.field = [...this.startField.map(elem => [...elem])];

        document.getElementById('sudoku').style.backgroundColor = '';
        this.printField();
    }

    checkErrors(isPaintCell = true) {
        let isHasError = false;

        this.failRows = [];
        this.failCols = [];
        this.failBlocks = [];

        for (let i = 0; i < 9; i++) {
            if(!this.checkBlock(i)) isHasError = true;
            if (!this.checkRow(i) || !this.checkColumn(i)) isHasError = true;
        }

        if (isHasError && isPaintCell) {
            if (this.failRows != null){
                for (let i = 0; i < 9; i++){
                    for (let row of this.failRows){
                        document.getElementsByTagName('td')[row * 9 + i].style.backgroundColor = 'red';
                    }
                }
            }

            if (this.failCols != null){
                for (let i = 0; i < 9; i++){
                    for (let col of this.failCols){
                        document.getElementsByTagName('td')[col + i * 9].style.backgroundColor = 'red';
                    }
                }
            }

            try {
                if (this.failBlocks != null){
                    for (let block of this.failBlocks){
                        for (let i = 0; i < 3; i++){
                            for (let j = 0; j < 3; j++){
                                document.getElementsByTagName('td')[9 * block[0] + block[1] + i * 9 + j].style.backgroundColor = 'red';
                            }
                        }
                    }
                }
            } catch {}
        }

        return isHasError;
    }

    checkRow(row) {
        let seen = {};

        for (let j = 0; j < 9; j++) {
            let num = this.field[row][j];

            if (num !== 0) {
                if (seen[num]) {
                    this.failRows.push(row);
                    return false;
                }
                seen[num] = true;
            }
        }
        return true;
    }

    checkColumn(col) {
        let seen = {};

        for (let i = 0; i < 9; i++) {
            let num = this.field[i][col];

            if (num !== 0) {
                if (seen[num]) {
                    this.failCols.push(col);
                    return false;
                }

                seen[num] = true;
            }
        }
        return true;
    }

    checkBlock(block) {
        let seen = {};
        let startRow = Math.floor(block / 3) * 3;
        let startCol = (block % 3) * 3;

        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                let num = this.field[i][j];

                if (num !== 0) {
                    if (seen[num]) {
                        this.failBlocks.push([startRow, startCol]);
                        return false;
                    }

                    seen[num] = true;
                }
            }
        }
        return true;
    }

    printField() {
        let table = document.getElementById('sudoku');
        table.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            let row = document.createElement('tr');

            for (let j = 0; j < 9; j++) {
                let cell = document.createElement('td');

                if (this.startField[i][j] != 0)
                    cell.style.backgroundColor = '#e9e9e9';
                else
                    cell.style.backgroundColor = 'white';

                cell.textContent = this.field[i][j] === 0 ? '' : this.field[i][j];

                row.appendChild(cell);
            }

            table.appendChild(row);
        }
    }

    addNumbersToField(y, x, number) {
        if (isNaN(number)) return

        if (y < 0 || y > 8 ||
            x < 0 || x > 8 ||
            number < 1 || number > 9 ||
            this.startField[y][x] != 0) return;

        this.field[y][x] = number;

        this.printField();

        this.checkFullField();
    }

    checkFullField() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.field[i][j] == 0) return;
            }
        }

        if (this.checkErrors(false) == true) return;

        for (let i = 0; i < 81; i++) {
            document.getElementsByTagName('td')[i].style.backgroundColor = '#ffff00'
        }
    }

    paint(cell, indexX, indexY, lastIndexX, lastIndexY) {

        if (this.startField[indexY][indexX] != 0) return false;

        if (lastIndexX != -1) {
            const lastCell = document.getElementsByTagName('td')[lastIndexY * 9 + lastIndexX];

            const color = lastCell.style.backgroundColor;

            lastCell.style.backgroundColor = color == 'rgba(255, 0, 255, 0.314)' || color == 'red' ? 'red' : 'white';
        }

        cell.style.backgroundColor = cell.style.backgroundColor == 'red' ? '#ff00ff50' : '#0000ff50';

        return true;
    }
}

const sudoku = new Sudoku();

let newField = document.getElementById('new-field');

newField.addEventListener('click', function () {
    sudoku.generateField();
    sudoku.printField();

    lastIndexX = -1;
    lastIndexY = -1;
});

let checkField = document.getElementById('check-field');

checkField.addEventListener('click', function () {
    sudoku.checkErrors();
});

let fullField = document.getElementById('full-field');

fullField.addEventListener('click', function () {
    sudoku.setEndField();
});

let resetField = document.getElementById('reset-field');

resetField.addEventListener('click', function () {
    sudoku.resetField();
});

let indexY = -1;
let indexX = -1;

let lastIndexX = -1;
let lastIndexY = -1;

document.querySelector('table').addEventListener('click', function (event) {
    let cell = event.target;

    if (cell.tagName.toLowerCase() === 'td') {
        indexY = cell.parentNode.rowIndex;
        indexX = cell.cellIndex;
    }

    if(sudoku.paint(cell, indexX, indexY, lastIndexX, lastIndexY) == false) return;

    lastIndexX = indexX;
    lastIndexY = indexY;
});

window.addEventListener('keydown', function (event) {
    sudoku.addNumbersToField(indexY, indexX, event.key);
});
