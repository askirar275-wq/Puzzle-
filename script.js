const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.75);
    canvas.width = size;
    canvas.height = size;
    draw();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const dots = [
    { x: 0.25, y: 0.25, color: "#ff3b30" },
    { x: 0.75, y: 0.25, color: "#34c759" },
    { x: 0.25, y: 0.75, color: "#007aff" },
    { x: 0.75, y: 0.75, color: "#ffcc00" }
];

let lines = [];
let drawing = false;
let startDot = null;

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;

    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

function drawBoard() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,canvas.width/2-10,0,Math.PI*2);
    ctx.fillStyle="#ffffff";
    ctx.fill();

    ctx.lineWidth=5;
    ctx.strokeStyle="#dddddd";
    ctx.stroke();

}

function drawDots(){

    dots.forEach(dot=>{

        const x=dot.x*canvas.width;
        const y=dot.y*canvas.height;

        ctx.beginPath();
        ctx.arc(x,y,18,0,Math.PI*2);
        ctx.fillStyle=dot.color;
        ctx.fill();

        ctx.lineWidth=5;
        ctx.strokeStyle="#fff";
        ctx.stroke();

    });

}

function drawLines(){

    ctx.lineWidth=10;
    ctx.lineCap="round";

    lines.forEach(line=>{

        ctx.strokeStyle=line.color;

        ctx.beginPath();

        ctx.moveTo(line.x1,line.y1);

        ctx.lineTo(line.x2,line.y2);

        ctx.stroke();

    });

}

function draw(){

    drawBoard();

    drawLines();

    drawDots();

}

function nearestDot(pos){

    for(let d of dots){

        const dx=pos.x-d.x*canvas.width;

        const dy=pos.y-d.y*canvas.height;

        if(Math.sqrt(dx*dx+dy*dy)<25){

            return d;

        }

    }

    return null;

}

canvas.addEventListener("pointerdown",e=>{

    const pos=getPos(e);

    startDot=nearestDot(pos);

    drawing=true;

});

canvas.addEventListener("pointerup",e=>{

    if(!drawing)return;

    const pos=getPos(e);

    const endDot=nearestDot(pos);

    if(startDot && endDot && startDot!==endDot){

        lines.push({

            x1:startDot.x*canvas.width,

            y1:startDot.y*canvas.height,

            x2:endDot.x*canvas.width,

            y2:endDot.y*canvas.height,

            color:startDot.color

        });

    }

    drawing=false;

    startDot=null;

    draw();

});

draw();
