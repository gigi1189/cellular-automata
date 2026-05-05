var grid = [];
var nextGrid = [];
var gridSize = 64;
var cellSize = 10;
let paused = true;
let showAge = false;
let rule = "conway";

const DEFAULTS = {
    gridSize: 64,
    cellSize: 10,
    speed: 12,
    rule: "conway",
    showAge: false,
    paused: true
};

const RULE_BLURBS = {
    conway: `For cells that are alive (black), the cell will persist if it has 2 or 3 neighboring cells that are also alive. It will die if it has fewer than 2 (loneliness) or more than 3 (overcrowding).

For cells that are dead, they will become alive again if they have exactly three neighbors.

It is a simple and classic cellular automaton which creates a stable and rare simulation.`,

    highlife: `For cells that are “alive” (black), the cell will persist if it has 2 or 3 neighboring cells that are also alive. It will die if it has fewer than 2 (loneliness) or more than 3 (overcrowding).

For cells that are dead, they will become alive again if they have exactly three neighbors, or six neighbors.

It is a variation of Conway’s Game of Life that introduces self-replicating patterns and more complex long-term structures.`,

    death: `For cells that are “alive” (black), the cell will always die in the next generation, regardless of its neighbors.

For cells that are dead, they will become alive again if they have exactly three neighbors.

It is a destructive rule set that creates short-lived bursts of activity followed by rapid collapse and regeneration.`,

    gigi: `For cells that are “alive” (black), the cell will follow normal survival rules but can only live for a limited amount of time before it dies of old age.

For cells that are dead, they will become alive again if they have exactly three neighbors.

It creates patterns that grow, peak, and naturally fade over time instead of lasting forever. Arguably the best cellular automaton.`};


window.onload = () => {
    document.getElementById("speed").value = DEFAULTS.speed;
    document.getElementById("cellSize").value = DEFAULTS.cellSize;
    document.getElementById("ruleSelect").value = DEFAULTS.rule;
    document.getElementById("ageToggle").checked = DEFAULTS.showAge;

    frameRate(DEFAULTS.speed);
    cellSize = DEFAULTS.cellSize;
    rule = DEFAULTS.rule;
    showAge = DEFAULTS.showAge;
    updateBlurb();
};

function setup() {
    frameRate(12);
    let canvas = createCanvas(640, 640);
    canvas.parent("#grid-holder");

    colorMode(HSB, 360, 100, 100);

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
    background(255);


    for (let x = 1; x < gridSize - 1; x++) {
        for (let y = 1; y < gridSize - 1; y++) {

            let cell = applyRules(x, y);

            // draw
            noStroke();

            let age = grid[x][y];

            if (!showAge) {
                fill(cell === 1 ? 0 : 255);
            } else {
                if (age === 0) {
                    fill(255);
                } else {
                    fill(ageColor(age));
                }
            }
            square(x * cellSize, y * cellSize, cellSize - 2);

            if (!paused) {
                if (cell === 1) {
                    nextGrid[x][y] = grid[x][y] + 1;
                } else {
                    nextGrid[x][y] = 0;
                }
            }
        }
    }

    if (!paused) {
        let temp = grid;
        grid = nextGrid;
        nextGrid = temp;
    }

    stats.alive = 0;

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (grid[x][y] > 0) stats.alive++;
        }
    }

    stats.density = stats.alive / (gridSize * gridSize) * 100;

    updateStatsUI();
}

//grid stats feature
function updateStatsUI() {
    document.getElementById("stats").innerHTML = `
    Alive: ${stats.alive}<br>
    Density: ${stats.density.toFixed(1)}%
  `;
}

//age color feature
function ageColor(age) {
    let maxAge = 50;
    let a = Math.min(age, maxAge);

    let hue = map(a, 0, maxAge, 0, 260);

    return color(hue, 90, 100);
}

//cell rules
function applyRules(x, y) {
    let neighbors =
        (grid[x - 1][y - 1] > 0) +
        (grid[x][y - 1] > 0) +
        (grid[x + 1][y - 1] > 0) +
        (grid[x - 1][y] > 0) +
        (grid[x + 1][y] > 0) +
        (grid[x - 1][y + 1] > 0) +
        (grid[x][y + 1] > 0) +
        (grid[x + 1][y + 1] > 0);
    let alive = grid[x][y] > 0;
    if (rule === "conway") {
        if (alive) {
            return (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
            return (neighbors === 3) ? 1 : 0;
        }
    }

    if (rule === "highlife") {
        if (alive) return (neighbors === 2 || neighbors === 3) ? 1 : 0;
        return (neighbors === 3 || neighbors === 6) ? 1 : 0;
    }

    if (rule === "death") {
        if (alive) return 0; // everything dies
        return (neighbors === 3) ? 1 : 0;
    }

    if (rule === "gigi") {
   

    if (alive) {
        // Conway survival rule first
        let survives = (neighbors === 2 || neighbors === 3);

        // age limit kills old cells
        if (grid[x][y] > 30) return 0;

        return survives ? 1 : 0;
    } else {
        return (neighbors === 3) ? 1 : 0;
    }
}
    return 0;
}

//drawing feature
function mouseDragged() {
    let x = floor(mouseX / cellSize);
    let y = floor(mouseY / cellSize);

    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        grid[x][y] = 1;
    }
};

//UI buttons
document.getElementById("toggleNav").onclick = () => {
    document.getElementById("layout").classList.toggle("collapsed");
};
document.getElementById("speed").oninput = (e) => {
    const val = Number(e.target.value);
    frameRate(val);
};
document.getElementById("cellSize").oninput = (e) => {
    cellSize = Number(e.target.value);
};

document.getElementById("ruleSelect").oninput = (e) => {
    rule = e.target.value;
    updateBlurb();
};

const btn = document.getElementById("playPauseBtn");

btn.onclick = () => {
    paused = !paused;

    btn.textContent = paused ? "▶" : "❚❚";
};

document.getElementById("ageToggle").oninput = (e) => {
    showAge = e.target.checked;
};

document.getElementById("ageInfo").onclick = () => {
    document.getElementById("agePopup").classList.toggle("show");
};

document.getElementById("simInfo").onclick = () => {
  document.getElementById("simPopup").classList.toggle("show");
};

function updateBlurb() {
    document.getElementById("ruleBlurb").innerText = RULE_BLURBS[rule];
}