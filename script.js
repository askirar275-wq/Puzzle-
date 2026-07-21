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
// ===============================
// BLOCK 2 : Game Variables
// ===============================

let currentLevel = 0;

let lines = [];

let activeLine = null;

let dragging = false;

let startNode = null;

const NODE_RADIUS = 18;

const LINE_WIDTH = 10;

const levels = [

{
nodes:[
{x:.20,y:.50,color:"#00ff55"},
{x:.80,y:.50,color:"#00ff55"},
{x:.50,y:.20,color:"#0066ff"},
{x:.50,y:.80,color:"#0066ff"}
]
}

];
// ===============================
// BLOCK 3 : Draw Game
// ===============================

function drawGame(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const level = levels[currentLevel];

// Board
ctx.beginPath();
ctx.arc(size/2,size/2,size/2-10,0,Math.PI*2);
ctx.fillStyle="#ffffff";
ctx.fill();

ctx.lineWidth=5;
ctx.strokeStyle="#222";
ctx.stroke();

// Saved Lines
ctx.lineWidth=LINE_WIDTH;
ctx.lineCap="round";

lines.forEach(line=>{

ctx.strokeStyle=line.color;

ctx.beginPath();
ctx.moveTo(line.x1,line.y1);
ctx.lineTo(line.x2,line.y2);
ctx.stroke();

});

// Nodes
level.nodes.forEach(node=>{

const x=node.x*size;
const y=node.y*size;

ctx.beginPath();
ctx.arc(x,y,NODE_RADIUS,0,Math.PI*2);
ctx.fillStyle=node.color;
ctx.fill();

ctx.lineWidth=4;
ctx.strokeStyle="#ffffff";
ctx.stroke();

});

}
drawGame();
// ===============================
// BLOCK 4 : Touch Controls
// ===============================

function getPos(e){

const rect=canvas.getBoundingClientRect();

return{

x:(e.clientX-rect.left),
y:(e.clientY-rect.top)

};

}

function findNode(x,y){

const nodes=levels[currentLevel].nodes;

for(let node of nodes){

const nx=node.x*size;
const ny=node.y*size;

const dx=x-nx;
const dy=y-ny;

if(Math.sqrt(dx*dx+dy*dy)<=NODE_RADIUS+10){

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

const pos=getPos(e);

const hit=findNode(pos.x,pos.y);

if(hit){

dragging=true;
startNode=hit;

activeLine={
x1:hit.x,
y1:hit.y,
x2:pos.x,
y2:pos.y,
color:hit.node.color
};

}

});
// ===============================
// BLOCK 5 : Live Line Drawing
// ===============================

canvas.addEventListener("pointermove",(e)=>{

if(!dragging || !activeLine) return;

const pos=getPos(e);

activeLine.x2=pos.x;
activeLine.y2=pos.y;

drawGame();

// Live Line
ctx.beginPath();
ctx.lineWidth=LINE_WIDTH;
ctx.lineCap="round";
ctx.strokeStyle=activeLine.color;

ctx.moveTo(
activeLine.x1,
activeLine.y1
);

ctx.lineTo(
activeLine.x2,
activeLine.y2
);

ctx.stroke();

});

canvas.addEventListener("pointerup",(e)=>{

if(!dragging) return;

const pos=getPos(e);

const hit=findNode(pos.x,pos.y);

if(hit && hit.node!==startNode.node){

lines.push({

x1:startNode.x,
y1:startNode.y,

x2:hit.x,
y2:hit.y,

color:startNode.node.color

});

}

dragging=false;
activeLine=null;
startNode=null;

drawGame();

});
// ===============================
// BLOCK 6 : Connection Check
// ===============================

function isSameColor(a,b){

    return a.color===b.color;

}

canvas.addEventListener("pointerup",(e)=>{

    if(!dragging) return;

    const pos=getPos(e);

    const hit=findNode(pos.x,pos.y);

    if(hit && hit.node!==startNode.node){

        if(isSameColor(startNode.node,hit.node)){

            const newLine={

    x1:startNode.x,
    y1:startNode.y,

    x2:hit.x,
    y2:hit.y,

    color:startNode.node.color

};

if(canAddLine(newLine)){

    lines.push(newLine);

}else{

    alert("❌ Lines cannot cross");

}
            // सभी Pair पूरे हुए?
            if(lines.length>=2){

                setTimeout(()=>{

                    alert("🎉 Level Complete");

                },200);

            }

        }else{

            alert("❌ Wrong Color");

        }

    }

    dragging=false;
    activeLine=null;
    startNode=null;

    drawGame();

});
// ===============================
// BLOCK 7 : Reset + Undo
// ===============================

// Reset Button
document.getElementById("reset").addEventListener("click",()=>{

lines=[];

dragging=false;

activeLine=null;

startNode=null;

drawGame();

});

// Undo Button
document.getElementById("undo").addEventListener("click",()=>{

if(lines.length>0){

lines.pop();

drawGame();

}

});
// ===============================
// BLOCK 8 : Hint System
// ===============================

document.getElementById("hint").addEventListener("click",()=>{

const nodes=levels[currentLevel].nodes;

alert(
"Hint:\nConnect same color dots together."
);

});
// ===============================
// BLOCK 9 : Next Level + Save
// ===============================

let coins = Number(localStorage.getItem("coins")) || 0;

document.getElementById("coins").textContent = coins;

function levelComplete(){

    coins += 10;

    localStorage.setItem("coins", coins);

    document.getElementById("coins").textContent = coins;

    calculateStars();

    alert("⭐ Stars : " + stars);

    document.getElementById("complete").style.display = "flex";

}
    

document.getElementById("next").addEventListener("click",()=>{

    document.getElementById("complete").style.display="none";

    currentLevel++;

    if(currentLevel>=levels.length){

        currentLevel=0;

    }

    lines=[];

    drawGame();

});
// ===============================
// BLOCK 10 : Line Crossing
// ===============================

function ccw(A,B,C){

    return (C.y-A.y)*(B.x-A.x) > (B.y-A.y)*(C.x-A.x);

}

function intersect(l1,l2){

    const A={x:l1.x1,y:l1.y1};
    const B={x:l1.x2,y:l1.y2};
    const C={x:l2.x1,y:l2.y1};
    const D={x:l2.x2,y:l2.y2};

    return ccw(A,C,D)!=ccw(B,C,D)
        &&
        ccw(A,B,C)!=ccw(A,B,D);

}

function canAddLine(newLine){

    for(const line of lines){

        if(intersect(newLine,line)){

            return false;

        }

    }

    return true;

                                        }// ===============================
// BLOCK 11 : More Levels
// ===============================

const levels=[

{
nodes:[
{x:.20,y:.50,color:"#00ff55"},
{x:.80,y:.50,color:"#00ff55"},
{x:.50,y:.20,color:"#0066ff"},
{x:.50,y:.80,color:"#0066ff"}
]
},

{
nodes:[
{x:.15,y:.20,color:"#ff0000"},
{x:.85,y:.80,color:"#ff0000"},
{x:.15,y:.80,color:"#00ff55"},
{x:.85,y:.20,color:"#00ff55"},
{x:.50,y:.15,color:"#0066ff"},
{x:.50,y:.85,color:"#0066ff"}
]
},

{
nodes:[
{x:.20,y:.20,color:"#ff0000"},
{x:.80,y:.20,color:"#00ff55"},
{x:.20,y:.80,color:"#0066ff"},
{x:.80,y:.80,color:"#ffff00"},
{x:.50,y:.35,color:"#ff0000"},
{x:.50,y:.65,color:"#ffff00"},
{x:.35,y:.50,color:"#00ff55"},
{x:.65,y:.50,color:"#0066ff"}
]
}

];let stars=3;

function calculateStars(){

if(lines.length>6){

stars=2;

}

if(lines.length>8){

stars=1;

}

 }const audio=new Audio();

function playSuccess(){

audio.src="success.mp3";

audio.play();

}

function playWrong(){

audio.src="wrong.mp3";

audio.play();

}
// ===============================
// BLOCK 12 : Star Rating
// ===============================

let stars = 3;

function calculateStars(){

    stars = 3;

    if(lines.length > 6){
        stars = 2;
    }

    if(lines.length > 8){
        stars = 1;
    }

}

function showStars(){

    let text = "";

    for(let i=0;i<stars;i++){
        text += "⭐";
    }

    alert("Level Complete!\nStars : " + text);

}
// ===============================
// BLOCK 13 : Sound Effects
// ===============================

const successSound = new Audio("success.mp3");

const wrongSound = new Audio("wrong.mp3");

function playSuccess(){

    successSound.currentTime = 0;
    successSound.play();

}

function playWrong(){

    wrongSound.currentTime = 0;
    wrongSound.play();

}
// ===============================
// BLOCK 14 : Glow Effects
// ===============================

function drawGlow(x,y,color){

    const g=ctx.createRadialGradient(
        x,y,5,
        x,y,40
    );

    g.addColorStop(0,color);
    g.addColorStop(1,"transparent");

    ctx.beginPath();

    ctx.fillStyle=g;

    ctx.arc(x,y,40,0,Math.PI*2);

    ctx.fill();

          }
// ===============================
// BLOCK 15 : Confetti
// ===============================

function confetti(){

    for(let i=0;i<50;i++){

        const x=Math.random()*canvas.width;

        const y=Math.random()*canvas.height;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            Math.random()*5+2,
            0,
            Math.PI*2
        );

        ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`;

        ctx.fill();

    }

    }
// ===============================
// BLOCK 16 : Animation Loop
// ===============================

function animate(){

    drawGame();

    requestAnimationFrame(animate);

}

animate();
// ===============================
// BLOCK 17 : Coin Shop
// ===============================

let shop = {

extraLife:false,

doubleCoins:false,

hintPack:3

};

function buyExtraLife(){

if(coins>=100){

coins-=100;

shop.extraLife=true;

localStorage.setItem("coins",coins);

alert("❤️ Extra Life Purchased");

}else{

alert("❌ Not Enough Coins");

}

}

function buyDoubleCoins(){

if(coins>=200){

coins-=200;

shop.doubleCoins=true;

localStorage.setItem("coins",coins);

alert("💰 Double Coins Activated");

}else{

alert("❌ Not Enough Coins");

}

    }
// ===============================
// BLOCK 18 : Lives
// ===============================

let lives=3;

function loseLife(){

lives--;

if(lives<=0){

alert("💀 Game Over");

lives=3;

currentLevel=0;

lines=[];

}

drawGame();

}
// ===============================
// BLOCK 19 : Save Progress
// ===============================

function saveProgress(){

localStorage.setItem("level",currentLevel);

localStorage.setItem("coins",coins);

}

function loadProgress(){

currentLevel=Number(localStorage.getItem("level"))||0;

coins=Number(localStorage.getItem("coins"))||0;

}
// ===============================
// BLOCK 20 : Finish
// ===============================

function gameFinished(){

alert(
"🏆 Congratulations!\nYou Completed All Levels!"
);

currentLevel=0;

saveProgress();

}
// ===============================
// BLOCK 21 : Home Screen
// ===============================

function showHome(){

    document.getElementById("home").style.display="flex";
    document.getElementById("gameArea").style.display="none";

}

function startGame(){

    document.getElementById("home").style.display="none";
    document.getElementById("gameArea").style.display="block";

    drawGame();

    }
// ===============================
// BLOCK 22 : Pause
// ===============================

let paused=false;

function pauseGame(){

    paused=true;

    alert("⏸ Game Paused");

}

function resumeGame(){

    paused=false;

}
// ===============================
// BLOCK 23 : Settings
// ===============================

let musicOn=true;

let soundOn=true;

function toggleMusic(){

musicOn=!musicOn;

alert("Music : "+(musicOn?"ON":"OFF"));

}

function toggleSound(){

soundOn=!soundOn;

alert("Sound : "+(soundOn?"ON":"OFF"));

}
// ===============================
// BLOCK 24 : Daily Reward
// ===============================

function dailyReward(){

coins+=50;

localStorage.setItem("coins",coins);

alert("🎁 Daily Reward +50 Coins");

}
// ===============================
// BLOCK 25 : Timer
// ===============================

let timeLeft = 60;
let timer = null;

function startTimer(){

    clearInterval(timer);

    timeLeft = 60;

    updateTimer();

    timer = setInterval(()=>{

        timeLeft--;

        updateTimer();

        if(timeLeft<=0){

            clearInterval(timer);

            loseLife();

            alert("⏰ Time Up!");

        }

    },1000);

}

function updateTimer(){

    const t=document.getElementById("timer");

    if(t){

        t.textContent=timeLeft;

    }

}
// ===============================
// BLOCK 26 : Score
// ===============================

let score = 0;

function addScore(points){

    score += points;

    const s=document.getElementById("score");

    if(s){

        s.textContent=score;

    }

}
// ===============================
// BLOCK 27 : Combo
// ===============================

let combo=0;

function addCombo(){

    combo++;

    if(combo>=3){

        score+=200;

        alert("🔥 Combo Bonus!");

        combo=0;

    }

}
// ===============================
// BLOCK 28 : Achievements
// ===============================

let achievements = {

firstWin:false,

tenWins:false,

hundredCoins:false

};

function checkAchievements(){

    if(!achievements.firstWin){

        achievements.firstWin=true;

        alert("🏅 Achievement Unlocked\nFirst Victory!");

    }

    if(coins>=100 && !achievements.hundredCoins){

        achievements.hundredCoins=true;

        alert("💰 Achievement Unlocked\n100 Coins!");

    }

}
// ===============================
// BLOCK 29 : Lucky Wheel
// ===============================

function spinWheel(){

    const rewards=[20,30,50,100];

    const reward=rewards[Math.floor(Math.random()*rewards.length)];

    coins+=reward;

    localStorage.setItem("coins",coins);

    alert("🎡 You Won "+reward+" Coins!");

}
// ===============================
// BLOCK 30 : Daily Mission
// ===============================

let mission={

target:3,

progress:0

};

function missionProgress(){

    mission.progress++;

    if(mission.progress>=mission.target){

        coins+=50;

        alert("🎁 Daily Mission Complete!");

        mission.progress=0;

    }

}
// ===============================
// BLOCK 31 : Gems
// ===============================

let gems = Number(localStorage.getItem("gems")) || 0;

function addGems(amount){

    gems += amount;

    localStorage.setItem("gems",gems);

    const g=document.getElementById("gems");

    if(g){

        g.textContent=gems;

    }

    }
// ===============================
// BLOCK 32 : Themes
// ===============================

const themes={

classic:"#ffffff",

dark:"#202020",

ocean:"#00bfff",

forest:"#2e8b57"

};

function changeTheme(name){

document.body.style.background=themes[name];

}
// ===============================
// BLOCK 33 : Reward Chest
// ===============================

function openChest(){

const reward=Math.floor(Math.random()*100)+50;

coins+=reward;

alert("📦 Chest Reward : "+reward+" Coins");

saveProgress();

                        }
// ===============================
// BLOCK 34 : Stats
// ===============================

let stats={

gamesPlayed:0,

levelsCompleted:0,

bestScore:0

};

function updateStats(){

stats.gamesPlayed++;

stats.levelsCompleted++;

if(score>stats.bestScore){

stats.bestScore=score;

}

    }
// ===============================
// BLOCK 35 : Win Animation
// ===============================

function winAnimation(){

canvas.style.transform="scale(1.08)";

setTimeout(()=>{

canvas.style.transform="scale(1)";

},300);

}
// ===============================
// BLOCK 36 : Leaderboard
// ===============================

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

function saveLeaderboard(){

    leaderboard.push(score);

    leaderboard.sort((a,b)=>b-a);

    leaderboard = leaderboard.slice(0,10);

    localStorage.setItem(
        "leaderboard",
        JSON.stringify(leaderboard)
    );

}
// ===============================
// BLOCK 37 : Daily Bonus
// ===============================

function dailyBonus(){

    const today=new Date().toDateString();

    const last=localStorage.getItem("dailyBonus");

    if(last!==today){

        coins+=100;

        localStorage.setItem("coins",coins);

        localStorage.setItem("dailyBonus",today);

        alert("🎁 Daily Bonus +100 Coins");

    }

}
// ===============================
// BLOCK 38 : Difficulty
// ===============================

let difficulty="Normal";

function setDifficulty(mode){

    difficulty=mode;

    switch(mode){

        case "Easy":

            timeLeft=90;

            break;

        case "Normal":

            timeLeft=60;

            break;

        case "Hard":

            timeLeft=40;

            break;

    }

}
// ===============================
// BLOCK 39 : Particles
// ===============================

function particleBurst(x,y,color){

    for(let i=0;i<20;i++){

        ctx.beginPath();

        ctx.arc(

            x+Math.random()*30-15,

            y+Math.random()*30-15,

            3,

            0,

            Math.PI*2

        );

        ctx.fillStyle=color;

        ctx.fill();

    }

}
// ===============================
// BLOCK 40 : UI Refresh
// ===============================

function refreshUI(){

    document.getElementById("coins").textContent=coins;

    document.getElementById("score").textContent=score;

    document.getElementById("level").textContent=currentLevel+1;

    }
