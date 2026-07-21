const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const playBtn = document.getElementById("playBtn");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentLevel = 0;

let nodes = [];

let lines = [];

let dragging = false;

let activeNode = null;

let currentPath = [];

const NODE_RADIUS = 18;
function resizeCanvas(){

canvas.width=window.innerWidth;

canvas.height=window.innerHeight-150;

}

window.addEventListener("resize",resizeCanvas);

resizeCanvas();
playBtn.onclick=()=>{

homeScreen.classList.add("hidden");

gameScreen.classList.remove("hidden");

loadLevel(currentLevel);

};
function loadLevel(level){

nodes=[];

LEVELS[level].nodes.forEach(n=>{

nodes.push({

x:n.x*canvas.width,

y:n.y*canvas.height,

color:n.color

});

});

lines=[];

draw();

}
function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

lines.forEach(line=>{

ctx.beginPath();

ctx.lineWidth=12;

ctx.lineCap="round";

ctx.lineJoin="round";

ctx.strokeStyle=line.color;

ctx.moveTo(line.points[0].x,line.points[0].y);

for(let i=1;i<line.points.length;i++){

ctx.lineTo(

line.points[i].x,

line.points[i].y

);

}

ctx.stroke();

});
    if(currentPath.length>1){

ctx.beginPath();

ctx.lineWidth=12;

ctx.lineCap="round";

ctx.lineJoin="round";

ctx.strokeStyle=activeNode.color;

ctx.moveTo(currentPath[0].x,currentPath[0].y);

for(let i=1;i<currentPath.length;i++){

ctx.lineTo(

currentPath[i].x,

currentPath[i].y

);

}

ctx.stroke();

    }
    nodes.forEach(node=>{

ctx.beginPath();

ctx.arc(

node.x,

node.y,

NODE_RADIUS,

0,

Math.PI*2

);

ctx.fillStyle=node.color;

ctx.fill();

ctx.lineWidth=4;

ctx.strokeStyle="white";

ctx.stroke();

});

}
function findNode(x,y){

for(const node of nodes){

const dx=x-node.x;

const dy=y-node.y;

if(Math.sqrt(dx*dx+dy*dy)<=NODE_RADIUS+10){

return node;

}

}

return null;

}
function getPos(e){

const rect=canvas.getBoundingClientRect();

return{

x:e.clientX-rect.left,

y:e.clientY-rect.top

};

    }
canvas.addEventListener("pointerdown",(e)=>{

const p=getPos(e);

const hit=findNode(p.x,p.y);

if(!hit)return;

dragging=true;

activeNode=hit;

currentPath=[

{

x:hit.x,

y:hit.y

}

];

draw();

});
canvas.addEventListener("pointermove",(e)=>{

if(!dragging)return;

const p=getPos(e);

currentPath.push({

x:p.x,

y:p.y

});

draw();

});
canvas.addEventListener("pointerup",(e)=>{

if(!dragging)return;

const p=getPos(e);

const hit=findNode(p.x,p.y);

if(hit && hit!==activeNode && hit.color===activeNode.color){

currentPath.push({

x:hit.x,

y:hit.y

});

lines=lines.filter(line=>line.color!==activeNode.color);

lines.push({

color:activeNode.color,

points:[...currentPath]

});

}

currentPath=[];

dragging=false;

activeNode=null;

draw();

});
canvas.addEventListener("pointerleave",()=>{

dragging=false;

activeNode=null;

currentPath=[];

draw();

});
function saveGame(){
    localStorage.setItem("flowLevel", currentLevel);
    localStorage.setItem("flowCoins", coins);
    localStorage.setItem("flowHints", hints);
}

function loadGame(){
    currentLevel = Number(localStorage.getItem("flowLevel")) || 0;
    coins = Number(localStorage.getItem("flowCoins")) || 0;
    hints = Number(localStorage.getItem("flowHints")) || 3;
}

loadGame();
loadLevel(currentLevel);
