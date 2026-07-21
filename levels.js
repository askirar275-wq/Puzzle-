const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const playBtn = document.getElementById("playBtn");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentLevel = 0;
let nodes = [];
let lines = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 150;
}

window.addEventListener("resize", resizeCanvas);

function loadLevel(level) {

    nodes = LEVELS[level].nodes.map(n => ({
        x: n.x * canvas.width,
        y: n.y * canvas.height,
        color: n.color
    }));

    lines = [];

    draw();

}

function draw() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    nodes.forEach(node=>{

        ctx.beginPath();
        ctx.arc(node.x,node.y,18,0,Math.PI*2);
        ctx.fillStyle=node.color;
        ctx.fill();

        ctx.lineWidth=4;
        ctx.strokeStyle="white";
        ctx.stroke();

    });

}

playBtn.addEventListener("click",()=>{

    homeScreen.style.display="none";

    gameScreen.style.display="flex";

    resizeCanvas();

    loadLevel(currentLevel);

});

resizeCanvas();
