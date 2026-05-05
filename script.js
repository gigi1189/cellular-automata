var grid = [];
var nextGrid = [];
var gridSize = 64;
var cellSize = 10;

document.getElementById("toggleNav").onclick = () => {
  document.getElementById("layout").classList.toggle("collapsed");
};

function setup() {
    frameRate(12);
    let canvas = createCanvas(640, 640);
    canvas.parent("#grid-holder");

    // create both grids
    for (let x = 0; x < gridSize; x++) {
        grid[x] = [];
        nextGrid[x] = [];
        for (let y = 0; y < gridSize; y++) {
            grid[x][y] = Math.round(Math.random());
            nextGrid[x][y] = 0;
        }
    }
}

function draw() {
    background(300);

    for (let x = 1; x < gridSize - 1; x++) {
        for (let y = 1; y < gridSize - 1; y++) {

            let cell = conway(x, y);

            // draw
            noStroke();
            //stroke(300);
            fill(cell === 1 ? 0 : 255);
            square(x * cellSize, y * cellSize, cellSize - 2);

            // store result in NEXT grid (not current one)
            nextGrid[x][y] = cell;
        }
    }

    // swap grids after full update
    let temp = grid;
    grid = nextGrid;
    nextGrid = temp;
}

function conway(x, y) {
    let neighbors =
        grid[x - 1][y - 1] + grid[x][y - 1] + grid[x + 1][y - 1] +
        grid[x - 1][y] + grid[x + 1][y] +
        grid[x - 1][y + 1] + grid[x][y + 1] + grid[x + 1][y + 1];

    if (grid[x][y] === 1) {
        return (neighbors === 2 || neighbors === 3) ? 1 : 0;
    } else {
        return (neighbors === 3) ? 1 : 0;
    }
}