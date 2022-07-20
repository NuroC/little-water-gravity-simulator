(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class MouseLines {
    static draw(ctx, Mouse) {


        ctx.beginPath();
        ctx.moveTo(canvas.height, canvas.width)
        ctx.lineTo(Mouse.x, Mouse.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(Mouse.x, Mouse.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke()
    }
}

module.exports = MouseLines;
},{}],2:[function(require,module,exports){
'use strict'

/**
 * circle-circle collision
 * @param {number} x1 center of circle 1
 * @param {number} y1 center of circle 1
 * @param {number} r1 radius of circle 1
 * @param {number} x2 center of circle 2
 * @param {number} y2 center of circle 2
 * @param {number} r2 radius of circle 2
 * @return {boolean}
 */
module.exports = function circleCircle(x1, y1, r1, x2, y2, r2) {
    var x = x1 - x2
    var y = y2 - y1
    var radii = r1 + r2
    return x * x + y * y <= radii * radii
}
},{}],3:[function(require,module,exports){
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
})

document.addEventListener("click", e => {
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



},{"./fun/mouseLines":1,"./structure/Canvas":4,"./structure/Obstacle":5,"./structure/RainCloud":6,"./structure/mouse":7,"./structure/waterdrop":8}],4:[function(require,module,exports){
class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }
    
    getCanvas() {
        return this.canvas;
    }
    
    getContext() {
        return this.context;
    }
    
    getWidth() {
        return this.width;
    }
    
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        this.height = height;
    }
    setWidth(width) {
        this.width = width;
    }
    static getCanvas() {
        return this.canvas;
    }

}

module.exports = Canvas;
},{}],5:[function(require,module,exports){
class Obstacle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();

    }
}

module.exports = Obstacle;
},{}],6:[function(require,module,exports){
const WaterDrop = require('./waterdrop');

class RainCloud {
    constructor(x, y, width, height, obstacles) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.waterdrops = [];
        this.obstacles = obstacles;
    }

    generateWater() {
        for (let i = 0; i < 200; i++) {
            let x = Math.random() * this.width;
            let y = Math.random() * this.height;
            this.waterdrops.push(new WaterDrop(x, y, this.obstacles));
        }
    }

    drawWater(ctx) {
        for (let i = 0; i < this.waterdrops.length; i++) {
            this.waterdrops[i].draw(ctx);
        }
    }
    getWaterrDebugInfo() {
        let avgVelocity = 0;
        for (let i = 0; i < this.waterdrops.length; i++) {
            avgVelocity += this.waterdrops[i].velocity.y;
        }

    }
}

module.exports = RainCloud;
},{"./waterdrop":8}],7:[function(require,module,exports){
class Mouse {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

module.exports = Mouse;
},{}],8:[function(require,module,exports){
const circleCircle = require("../math/circlecircle");

class Waterdrop {
    constructor(x, y, obstacles) {
        this.x = x;
        this.y = y;
        this.radius = 5
        this.color = '#0095ff';
        this.speed = .01;
        this.obstacles = obstacles;
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        this.update(ctx);
    }
    update(ctx) {
        this.x += this.velocity.x / 2;
        this.y += this.velocity.y / 2;

        this.velocity.y += this.speed;
        if (this.velocity.y > 3) {
            this.velocity.y *= .9;
        }
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];
            let cc = circleCircle(this.x, this.y, this.radius, obstacle.x, obstacle.y, obstacle.radius)
            if (cc) {
                this.resolveCollision(this, obstacle);
            }
        }
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }
    resolveCollision(c1, c2) {
        let distance_x = c1.x - c2.x;
        let distance_y = c1.y - c2.y;
        let radii_sum = c1.radius + c2.radius;
        let length = Math.sqrt(distance_x * distance_x + distance_y * distance_y) || 1;
        let unit_x = distance_x / length;
        let unit_y = distance_y / length;
        let overlap = radii_sum - length;
        c1.x += unit_x * overlap / 2;
        c1.y += unit_y * overlap / 2;
        return overlap;
    }
}
module.exports = Waterdrop;
},{"../math/circlecircle":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnVuL21vdXNlTGluZXMuanMiLCJzcmMvbWF0aC9jaXJjbGVjaXJjbGUuanMiLCJzcmMvc2NyaXB0LmpzIiwic3JjL3N0cnVjdHVyZS9DYW52YXMuanMiLCJzcmMvc3RydWN0dXJlL09ic3RhY2xlLmpzIiwic3JjL3N0cnVjdHVyZS9SYWluQ2xvdWQuanMiLCJzcmMvc3RydWN0dXJlL21vdXNlLmpzIiwic3JjL3N0cnVjdHVyZS93YXRlcmRyb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIE1vdXNlTGluZXMge1xyXG4gICAgc3RhdGljIGRyYXcoY3R4LCBNb3VzZSkge1xyXG5cclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oY2FudmFzLmhlaWdodCwgY2FudmFzLndpZHRoKVxyXG4gICAgICAgIGN0eC5saW5lVG8oTW91c2UueCwgTW91c2UueSk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKE1vdXNlLngsIE1vdXNlLnksIDEwLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKClcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZUxpbmVzOyIsIid1c2Ugc3RyaWN0J1xyXG5cclxuLyoqXHJcbiAqIGNpcmNsZS1jaXJjbGUgY29sbGlzaW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSBjZW50ZXIgb2YgY2lyY2xlIDFcclxuICogQHBhcmFtIHtudW1iZXJ9IHkxIGNlbnRlciBvZiBjaXJjbGUgMVxyXG4gKiBAcGFyYW0ge251bWJlcn0gcjEgcmFkaXVzIG9mIGNpcmNsZSAxXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MiBjZW50ZXIgb2YgY2lyY2xlIDJcclxuICogQHBhcmFtIHtudW1iZXJ9IHkyIGNlbnRlciBvZiBjaXJjbGUgMlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcjIgcmFkaXVzIG9mIGNpcmNsZSAyXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNpcmNsZUNpcmNsZSh4MSwgeTEsIHIxLCB4MiwgeTIsIHIyKSB7XHJcbiAgICB2YXIgeCA9IHgxIC0geDJcclxuICAgIHZhciB5ID0geTIgLSB5MVxyXG4gICAgdmFyIHJhZGlpID0gcjEgKyByMlxyXG4gICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgPD0gcmFkaWkgKiByYWRpaVxyXG59IiwiY29uc3QgQ2FudmFzID0gcmVxdWlyZSgnLi9zdHJ1Y3R1cmUvQ2FudmFzJyk7XHJcbmNvbnN0IE1vdXNlID0gcmVxdWlyZSgnLi9zdHJ1Y3R1cmUvbW91c2UnKTtcclxuY29uc3QgUmFpbkNsb3VkID0gcmVxdWlyZSgnLi9zdHJ1Y3R1cmUvUmFpbkNsb3VkJyk7XHJcbmNvbnN0IE1vdXNlTGluZXMgPSByZXF1aXJlKFwiLi9mdW4vbW91c2VMaW5lc1wiKTtcclxuY29uc3QgT2JzdGFjbGUgPSByZXF1aXJlKCcuL3N0cnVjdHVyZS9PYnN0YWNsZScpO1xyXG5jb25zdCBXYXRlckRyb3AgPSByZXF1aXJlKCcuL3N0cnVjdHVyZS93YXRlcmRyb3AnKTtcclxuY29uc3QgY2FudmFzID0gbmV3IENhbnZhcygxOTIwLCAxMDgwKTtcclxuXHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCk7XHJcbnZhciBPYnN0YWNsZXMgPSBbXHJcbiAgICBuZXcgT2JzdGFjbGUoNTAwLCA2MDAsIDEwMCksXHJcbiAgICBuZXcgT2JzdGFjbGUoMjAwLCA2MDAsIDEwMCksICBcclxuICAgIG5ldyBPYnN0YWNsZSg4MDAsIDYwMCwgMTAwKSxcclxuICAgIG5ldyBPYnN0YWNsZSgxMTAwLCA2MDAsIDEwMCksXHJcblxyXG5dXHJcbmNvbnN0IGNsb3VkID0gbmV3IFJhaW5DbG91ZCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsIE9ic3RhY2xlcyk7XHJcbmxldCB3YXRlcmRyb3BzID0gW11cclxuY2xvdWQuZ2VuZXJhdGVXYXRlcigpO1xyXG5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBNb3VzZS54ID0gZS5jbGllbnRYO1xyXG4gICAgTW91c2UueSA9IGUuY2xpZW50WTtcclxufSlcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgIGlmIChlLmJ1dHRvbiA9PT0gMCkge1xyXG4gICAgICAgIGxldCBuZWFyZXN0T2JzdGFjbGUgPSBPYnN0YWNsZXMucmVkdWNlKChuZWFyZXN0LCBvYnN0YWNsZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cob2JzdGFjbGUueCAtIE1vdXNlLngsIDIpICsgTWF0aC5wb3cob2JzdGFjbGUueSAtIE1vdXNlLnksIDIpKTtcclxuICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgbmVhcmVzdC5kaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgbmVhcmVzdC5kaXN0YW5jZSA9IGRpc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgbmVhcmVzdC5vYnN0YWNsZSA9IG9ic3RhY2xlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuZWFyZXN0O1xyXG4gICAgICAgIH0sIHsgZGlzdGFuY2U6IEluZmluaXR5LCBvYnN0YWNsZTogbnVsbCB9KTtcclxuICAgICAgICBpZiAobmVhcmVzdE9ic3RhY2xlLm9ic3RhY2xlKSB7XHJcbiAgICAgICAgICAgIE9ic3RhY2xlcy5zcGxpY2UoT2JzdGFjbGVzLmluZGV4T2YobmVhcmVzdE9ic3RhY2xlLm9ic3RhY2xlKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgT2JzdGFjbGVzLnB1c2gobmV3IE9ic3RhY2xlKGUuY2xpZW50WCwgZS5jbGllbnRZLCAxMDApKTtcclxufSlcclxuXHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuXHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKDAsIDApO1xyXG4gICAgY3R4LmxpbmVUbyhjYW52YXMud2lkdGgsIDApO1xyXG4gICAgY3R4LmxpbmVUbyhjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgY3R4LmxpbmVUbygwLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGN0eC5saW5lVG8oMCwgMCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgXHJcbiAgICBPYnN0YWNsZXMuZm9yRWFjaChvYnN0YWNsZSA9PiB7XHJcbiAgICAgICAgb2JzdGFjbGUuZHJhdyhjdHgpO1xyXG4gICAgfSlcclxuICAgIGNsb3VkLmRyYXdXYXRlcihjdHgpO1xyXG5cclxuXHJcbiAgICB3YXRlcmRyb3BzLmZvckVhY2goZHJvcCA9PiB7XHJcbiAgICAgICAgZHJvcC5kcmF3KGN0eCk7XHJcbiAgICB9KVxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShpbml0KTtcclxufVxyXG5cclxuaW5pdCgpXHJcblxyXG5cclxuIiwiY2xhc3MgQ2FudmFzIHtcclxuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0Q2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0Q29udGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0SGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuICAgIHNldEhlaWdodChoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuICAgIHNldFdpZHRoKHdpZHRoKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENhbnZhcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXM7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhczsiLCJjbGFzcyBPYnN0YWNsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCByYWRpdXMpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT2JzdGFjbGU7IiwiY29uc3QgV2F0ZXJEcm9wID0gcmVxdWlyZSgnLi93YXRlcmRyb3AnKTtcclxuXHJcbmNsYXNzIFJhaW5DbG91ZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvYnN0YWNsZXMpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMud2F0ZXJkcm9wcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub2JzdGFjbGVzID0gb2JzdGFjbGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlV2F0ZXIoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDA7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgeCA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoO1xyXG4gICAgICAgICAgICBsZXQgeSA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy53YXRlcmRyb3BzLnB1c2gobmV3IFdhdGVyRHJvcCh4LCB5LCB0aGlzLm9ic3RhY2xlcykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3V2F0ZXIoY3R4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhdGVyZHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy53YXRlcmRyb3BzW2ldLmRyYXcoY3R4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRXYXRlcnJEZWJ1Z0luZm8oKSB7XHJcbiAgICAgICAgbGV0IGF2Z1ZlbG9jaXR5ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2F0ZXJkcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhdmdWZWxvY2l0eSArPSB0aGlzLndhdGVyZHJvcHNbaV0udmVsb2NpdHkueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJhaW5DbG91ZDsiLCJjbGFzcyBNb3VzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vdXNlOyIsImNvbnN0IGNpcmNsZUNpcmNsZSA9IHJlcXVpcmUoXCIuLi9tYXRoL2NpcmNsZWNpcmNsZVwiKTtcclxuXHJcbmNsYXNzIFdhdGVyZHJvcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBvYnN0YWNsZXMpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSA1XHJcbiAgICAgICAgdGhpcy5jb2xvciA9ICcjMDA5NWZmJztcclxuICAgICAgICB0aGlzLnNwZWVkID0gLjAxO1xyXG4gICAgICAgIHRoaXMub2JzdGFjbGVzID0gb2JzdGFjbGVzO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKGN0eCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY3R4KSB7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMudmVsb2NpdHkueCAvIDI7XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMudmVsb2NpdHkueSAvIDI7XHJcblxyXG4gICAgICAgIHRoaXMudmVsb2NpdHkueSArPSB0aGlzLnNwZWVkO1xyXG4gICAgICAgIGlmICh0aGlzLnZlbG9jaXR5LnkgPiAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSAqPSAuOTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9ic3RhY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JzdGFjbGUgPSB0aGlzLm9ic3RhY2xlc1tpXTtcclxuICAgICAgICAgICAgbGV0IGNjID0gY2lyY2xlQ2lyY2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgb2JzdGFjbGUueCwgb2JzdGFjbGUueSwgb2JzdGFjbGUucmFkaXVzKVxyXG4gICAgICAgICAgICBpZiAoY2MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUNvbGxpc2lvbih0aGlzLCBvYnN0YWNsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMuc3BlZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMueSA+IGNhbnZhcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKSAqIGNhbnZhcy53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXNvbHZlQ29sbGlzaW9uKGMxLCBjMikge1xyXG4gICAgICAgIGxldCBkaXN0YW5jZV94ID0gYzEueCAtIGMyLng7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlX3kgPSBjMS55IC0gYzIueTtcclxuICAgICAgICBsZXQgcmFkaWlfc3VtID0gYzEucmFkaXVzICsgYzIucmFkaXVzO1xyXG4gICAgICAgIGxldCBsZW5ndGggPSBNYXRoLnNxcnQoZGlzdGFuY2VfeCAqIGRpc3RhbmNlX3ggKyBkaXN0YW5jZV95ICogZGlzdGFuY2VfeSkgfHwgMTtcclxuICAgICAgICBsZXQgdW5pdF94ID0gZGlzdGFuY2VfeCAvIGxlbmd0aDtcclxuICAgICAgICBsZXQgdW5pdF95ID0gZGlzdGFuY2VfeSAvIGxlbmd0aDtcclxuICAgICAgICBsZXQgb3ZlcmxhcCA9IHJhZGlpX3N1bSAtIGxlbmd0aDtcclxuICAgICAgICBjMS54ICs9IHVuaXRfeCAqIG92ZXJsYXAgLyAyO1xyXG4gICAgICAgIGMxLnkgKz0gdW5pdF95ICogb3ZlcmxhcCAvIDI7XHJcbiAgICAgICAgcmV0dXJuIG92ZXJsYXA7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBXYXRlcmRyb3A7Il19
