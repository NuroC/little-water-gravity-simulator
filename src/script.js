const Canvas = require('./structure/Canvas');
const Mouse = require('./structure/mouse');
const RainCloud = require('./structure/RainCloud');
const MouseLines = require("./fun/mouseLines");
const Obstacle = require('./structure/Obstacle');
const WaterDrop = require('./structure/waterdrop');
const canvas = new Canvas(1920, 1080);

const ctx = canvas.getContext();
const Obstacles = [
    new Obstacle(500, 600, 100),
    new Obstacle(200, 600, 100),  
    new Obstacle(800, 600, 100),
    new Obstacle(1100, 600, 100),

]
const cloud = new RainCloud(0, 0, canvas.width, canvas.height, Obstacles);
let waterdrops = []
cloud.generateWater();


document.addEventListener('mousemove', function (e) {
    Mouse.x = e.clientX;
    Mouse.y = e.clientY;
    // let drop = new WaterDrop(Mouse.x, Mouse.y, Obstacles);
    // waterdrops.push(drop);
    // if(waterdrops.length > 2000) {
    //     waterdrops.shift();
    // }
})



function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, 0);
    ctx.stroke();

    
    Obstacles.forEach(obstacle => {
        obstacle.draw(ctx);
    })
    cloud.drawWater(ctx);


    waterdrops.forEach(drop => {
        drop.draw(ctx);
    })
    window.requestAnimationFrame(init);
}

init()

