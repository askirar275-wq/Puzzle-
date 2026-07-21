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
// ===============================
// PART 2 : Touch Controls
// ===============================

function getPos(e){

    const rect=canvas.getBoundingClientRect();

    return{
        x:e.clientX-rect.left,
        y:e.clientY-rect.top
    };

}

function findNode(x,y){

    const nodes=levels[currentLevel].nodes;

    for(const node of nodes){

        const nx=node.x*size;
        const ny=node.y*size;

        const dx=x-nx;
        const dy=y-ny;

        if(Math.sqrt(dx*dx+dy*dy)<=NODE_RADIUS+8){

            return{
                node,
                x:nx,
                y:ny
            };

        }

    }

    return null;

}

canvas.addEventListener("pointerdown",(e)=>{

    const hit=findNode(getPos(e).x,getPos(e).y);

    if(hit){

        dragging=true;
        activeNode=hit;

    }

});

canvas.addEventListener("pointermove",(e)=>{

    if(!dragging || !activeNode) return;

    drawGame();

    const p=getPos(e);

    ctx.beginPath();

    ctx.lineWidth=10;
    ctx.lineCap="round";
    ctx.strokeStyle=activeNode.node.color;

    ctx.moveTo(activeNode.x,activeNode.y);

    ctx.lineTo(p.x,p.y);

    ctx.stroke();

});

canvas.addEventListener("pointerup",(e)=>{

    if(!dragging || !activeNode) return;

    const hit=findNode(getPos(e).x,getPos(e).y);

    if(hit && hit.node!==activeNode.node){

        if(hit.node.color===activeNode.node.color){

            lines.push({

                x1:activeNode.x,
                y1:activeNode.y,

                x2:hit.x,
                y2:hit.y,

                color:activeNode.node.color

            });

        }

    }

    dragging=false;
    activeNode=null;

    drawGame();

});
