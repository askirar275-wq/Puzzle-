// ===============================
// COLOR CONNECT ENGINE - PART 1
// ===============================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let size;

function resizeCanvas(){

    size = Math.min(window.innerWidth*0.9,500);

    canvas.width=size;
    canvas.height=size;

    drawGame();

}

window.addEventListener("resize",resizeCanvas);

let currentLevel=0;

let lines=[];

let dragging=false;

let activeNode=null;

const NODE_RADIUS=18;

const levels=[

{
nodes:[

{x:.2,y:.5,color:"#ff3b30"},
{x:.8,y:.5,color:"#ff3b30"},

{x:.5,y:.2,color:"#2196f3"},
{x:.5,y:.8,color:"#2196f3"}

]

}

];

function drawGame(){

ctx.clearRect(0,0,size,size);

ctx.beginPath();
ctx.arc(size/2,size/2,size/2-8,0,Math.PI*2);
ctx.fillStyle="#ffffff";
ctx.fill();

ctx.lineWidth=4;
ctx.strokeStyle="#dddddd";
ctx.stroke();

ctx.lineWidth=10;
ctx.lineCap="round";

lines.forEach(line=>{

ctx.strokeStyle=line.color;

ctx.beginPath();

ctx.moveTo(line.x1,line.y1);

ctx.lineTo(line.x2,line.y2);

ctx.stroke();

});

levels[currentLevel].nodes.forEach(node=>{

const x=node.x*size;

const y=node.y*size;

ctx.beginPath();

ctx.arc(x,y,NODE_RADIUS,0,Math.PI*2);

ctx.fillStyle=node.color;

ctx.fill();

ctx.lineWidth=3;
ctx.strokeStyle="#ffffff";
ctx.stroke();

});

}

resizeCanvas();

// =======================
// Play Button
// =======================

const playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", () => {

    document.getElementById("home").style.display = "none";

    document.getElementById("gameArea").style.display = "block";

    resizeCanvas();

});
