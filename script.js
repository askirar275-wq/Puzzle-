
// ===============================
// BLOCK 1 : Canvas Setup
// ===============================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let size = 0;

function resizeCanvas() {

    size = Math.min(window.innerWidth * 0.92, window.innerHeight * 0.72);

    canvas.width = size;
    canvas.height = size;

    if (typeof drawGame === "function") {
        drawGame();
    }
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.75);
    canvas.width = size;
    canvas.height = size;
    draw();
}

window.addEventListener("resize", resizeCanvas);

// 2 Red + 2 Blue Dots
const dots = [
    { x:0.25,y:0.25,color:"red"},
    { x:0.75,y:0.25,color:"red"},
    { x:0.25,y:0.75,color:"blue"},
    { x:0.75,y:0.75,color:"blue"}
];

// सही Pair
const pairs=[
    {a:0,b:1},
    {a:2,b:3}
];

let completed=[];
let lines=[];
let drawing=false;
let startDot=null;

function getPos(e){
    const rect=canvas.getBoundingClientRect();
    return{
        x:e.clientX-rect.left,
        y:e.clientY-rect.top
    };
}

function nearestDot(pos){

    for(let d of dots){

        let dx=pos.x-d.x*canvas.width;
        let dy=pos.y-d.y*canvas.height;

        if(Math.sqrt(dx*dx+dy*dy)<25){
            return d;
        }

    }

    return null;
}

function checkConnection(start,end){

    let s=dots.indexOf(start);
    let e=dots.indexOf(end);

    for(let p of pairs){

        if(
            (p.a==s&&p.b==e)||
            (p.a==e&&p.b==s)
        ){

            completed.push(p);

            if(completed.length==pairs.length){

                document
                .getElementById("completeBox")
                .classList.remove("hide");

            }

            return true;
        }

    }

    return false;

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Circle
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,canvas.width/2-10,0,Math.PI*2);
    ctx.fillStyle="white";
    ctx.fill();
    ctx.strokeStyle="#ddd";
    ctx.lineWidth=4;
    ctx.stroke();

    // Lines
    ctx.lineWidth=10;
    ctx.lineCap="round";

    for(let l of lines){

        ctx.strokeStyle=l.color;

        ctx.beginPath();

        ctx.moveTo(l.x1,l.y1);

        ctx.lineTo(l.x2,l.y2);

        ctx.stroke();

    }

    // Dots
    for(let d of dots){

        let x=d.x*canvas.width;
        let y=d.y*canvas.height;

        ctx.beginPath();
        ctx.arc(x,y,18,0,Math.PI*2);
        ctx.fillStyle=d.color;
        ctx.fill();

        ctx.lineWidth=5;
        ctx.strokeStyle="white";
        ctx.stroke();

    }

}

canvas.addEventListener("pointerdown",e=>{

    startDot=nearestDot(getPos(e));

    drawing=true;

});

canvas.addEventListener("pointerup",e=>{

    if(!drawing)return;

    let endDot=nearestDot(getPos(e));

    if(startDot&&endDot&&startDot!=endDot){

        if(checkConnection(startDot,endDot)){

            lines.push({

                x1:startDot.x*canvas.width,
                y1:startDot.y*canvas.height,
                x2:endDot.x*canvas.width,
                y2:endDot.y*canvas.height,
                color:startDot.color

            });

        }else{

            alert("Wrong Connection");

        }

    }

    drawing=false;
    startDot=null;

    draw();

});

document.getElementById("resetBtn").onclick=function(){

    lines=[];
    completed=[];
    draw();

}

document.getElementById("undoBtn").onclick=function(){

    lines.pop();
    completed.pop();

    draw();

}

document.getElementById("nextBtn").onclick=function(){

    alert("Level 2 Coming Soon...");

}

resizeCanvas();
