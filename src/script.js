const Canvas = require('./structure/Canvas');
const Mouse = require('./structure/mouse');
const RainCloud = require('./structure/RainCloud');
const MouseLines = require("./fun/mouseLines");
const Obstacle = require('./structure/Obstacle');
const WaterDrop = require('./structure/waterdrop');
const canvas = new Canvas(1920, 1080);

const ctx = canvas.getContext();
var Obstacles = [
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

document.addEventListener("click", e => {
    // delete the nearest obstacle on left click
    if (e.button === 0) {
        let nearestObstacle = Obstacles.reduce((nearest, obstacle) => {
            let distance = Math.sqrt(Math.pow(obstacle.x - Mouse.x, 2) + Math.pow(obstacle.y - Mouse.y, 2));
            if (distance < nearest.distance) {
                nearest.distance = distance;
                nearest.obstacle = obstacle;
            }
            return nearest;
        }, { distance: Infinity, obstacle: null });
        if (nearestObstacle.obstacle) {
            Obstacles.splice(Obstacles.indexOf(nearestObstacle.obstacle), 1);
        }
    }
    Obstacles.push(new Obstacle(e.clientX, e.clientY, 100));
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

