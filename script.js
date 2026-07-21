const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let currentLevel = 0;

let dragging = false;
let activeNode = null;
let currentPath = [];
let lines = [];

const NODE_RADIUS = 18;

const levels = [

{
nodes:[
{x:0.2,y:0.2,color:"#ff3b30"},
{x:0.8,y:0.8,color:"#ff3b30"},
{x:0.8,y:0.2,color:"#2196f3"},
{x:0.2,y:0.8,color:"#2196f3"}
]
},

{
nodes:[
{x:0.2,y:0.2,color:"#ff3b30"},
{x:0.8,y:0.8,color:"#ff3b30"},
{x:0.8,y:0.2,color:"#34c759"},
{x:0.2,y:0.8,color:"#34c759"},
{x:0.5,y:0.2,color:"#007aff"},
{x:0.5,y:0.8,color:"#007aff"}
]

}

];

function resizeCanvas(){

canvas.width=window.innerWidth;

canvas.height=window.innerHeight-120;

drawGame();

}

window.addEventListener("resize",resizeCanvas);

function getNodes(){

return levels[currentLevel].nodes.map(n=>({

x:n.x*canvas.width,

y:n.y*canvas.height,

color:n.color,

node:n

}));

}

function drawGame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const nodes=getNodes();

lines.forEach(line=>{

ctx.beginPath();

ctx.lineWidth=12;

ctx.lineCap="round";

ctx.lineJoin="round";

ctx.strokeStyle=line.color;

ctx.moveTo(line.points[0].x,line.points[0].y);

for(let i=1;i<line.points.length;i++){

ctx.lineTo(line.points[i].x,line.points[i].y);

}

ctx.stroke();

});

nodes.forEach(n=>{

ctx.beginPath();

ctx.fillStyle=n.color;

ctx.arc(n.x,n.y,NODE_RADIUS,0,Math.PI*2);

ctx.fill();

});

}

resizeCanvas();
