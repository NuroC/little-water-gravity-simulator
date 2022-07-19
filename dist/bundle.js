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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnVuL21vdXNlTGluZXMuanMiLCJzcmMvbWF0aC9jaXJjbGVjaXJjbGUuanMiLCJzcmMvc2NyaXB0LmpzIiwic3JjL3N0cnVjdHVyZS9DYW52YXMuanMiLCJzcmMvc3RydWN0dXJlL09ic3RhY2xlLmpzIiwic3JjL3N0cnVjdHVyZS9SYWluQ2xvdWQuanMiLCJzcmMvc3RydWN0dXJlL21vdXNlLmpzIiwic3JjL3N0cnVjdHVyZS93YXRlcmRyb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBNb3VzZUxpbmVzIHtcclxuICAgIHN0YXRpYyBkcmF3KGN0eCwgTW91c2UpIHtcclxuXHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aClcclxuICAgICAgICBjdHgubGluZVRvKE1vdXNlLngsIE1vdXNlLnkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyhNb3VzZS54LCBNb3VzZS55LCAxMCwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW91c2VMaW5lczsiLCIndXNlIHN0cmljdCdcclxuXHJcbi8qKlxyXG4gKiBjaXJjbGUtY2lyY2xlIGNvbGxpc2lvblxyXG4gKiBAcGFyYW0ge251bWJlcn0geDEgY2VudGVyIG9mIGNpcmNsZSAxXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSBjZW50ZXIgb2YgY2lyY2xlIDFcclxuICogQHBhcmFtIHtudW1iZXJ9IHIxIHJhZGl1cyBvZiBjaXJjbGUgMVxyXG4gKiBAcGFyYW0ge251bWJlcn0geDIgY2VudGVyIG9mIGNpcmNsZSAyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MiBjZW50ZXIgb2YgY2lyY2xlIDJcclxuICogQHBhcmFtIHtudW1iZXJ9IHIyIHJhZGl1cyBvZiBjaXJjbGUgMlxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjaXJjbGVDaXJjbGUoeDEsIHkxLCByMSwgeDIsIHkyLCByMikge1xyXG4gICAgdmFyIHggPSB4MSAtIHgyXHJcbiAgICB2YXIgeSA9IHkyIC0geTFcclxuICAgIHZhciByYWRpaSA9IHIxICsgcjJcclxuICAgIHJldHVybiB4ICogeCArIHkgKiB5IDw9IHJhZGlpICogcmFkaWlcclxufSIsImNvbnN0IENhbnZhcyA9IHJlcXVpcmUoJy4vc3RydWN0dXJlL0NhbnZhcycpO1xyXG5jb25zdCBNb3VzZSA9IHJlcXVpcmUoJy4vc3RydWN0dXJlL21vdXNlJyk7XHJcbmNvbnN0IFJhaW5DbG91ZCA9IHJlcXVpcmUoJy4vc3RydWN0dXJlL1JhaW5DbG91ZCcpO1xyXG5jb25zdCBNb3VzZUxpbmVzID0gcmVxdWlyZShcIi4vZnVuL21vdXNlTGluZXNcIik7XHJcbmNvbnN0IE9ic3RhY2xlID0gcmVxdWlyZSgnLi9zdHJ1Y3R1cmUvT2JzdGFjbGUnKTtcclxuY29uc3QgV2F0ZXJEcm9wID0gcmVxdWlyZSgnLi9zdHJ1Y3R1cmUvd2F0ZXJkcm9wJyk7XHJcbmNvbnN0IGNhbnZhcyA9IG5ldyBDYW52YXMoMTkyMCwgMTA4MCk7XHJcblxyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgpO1xyXG5jb25zdCBPYnN0YWNsZXMgPSBbXHJcbiAgICBuZXcgT2JzdGFjbGUoNTAwLCA2MDAsIDEwMCksXHJcbiAgICBuZXcgT2JzdGFjbGUoMjAwLCA2MDAsIDEwMCksICBcclxuICAgIG5ldyBPYnN0YWNsZSg4MDAsIDYwMCwgMTAwKSxcclxuICAgIG5ldyBPYnN0YWNsZSgxMTAwLCA2MDAsIDEwMCksXHJcblxyXG5dXHJcbmNvbnN0IGNsb3VkID0gbmV3IFJhaW5DbG91ZCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsIE9ic3RhY2xlcyk7XHJcbmxldCB3YXRlcmRyb3BzID0gW11cclxuY2xvdWQuZ2VuZXJhdGVXYXRlcigpO1xyXG5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBNb3VzZS54ID0gZS5jbGllbnRYO1xyXG4gICAgTW91c2UueSA9IGUuY2xpZW50WTtcclxuICAgIC8vIGxldCBkcm9wID0gbmV3IFdhdGVyRHJvcChNb3VzZS54LCBNb3VzZS55LCBPYnN0YWNsZXMpO1xyXG4gICAgLy8gd2F0ZXJkcm9wcy5wdXNoKGRyb3ApO1xyXG4gICAgLy8gaWYod2F0ZXJkcm9wcy5sZW5ndGggPiAyMDAwKSB7XHJcbiAgICAvLyAgICAgd2F0ZXJkcm9wcy5zaGlmdCgpO1xyXG4gICAgLy8gfVxyXG59KVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuXHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKDAsIDApO1xyXG4gICAgY3R4LmxpbmVUbyhjYW52YXMud2lkdGgsIDApO1xyXG4gICAgY3R4LmxpbmVUbyhjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgY3R4LmxpbmVUbygwLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGN0eC5saW5lVG8oMCwgMCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgXHJcbiAgICBPYnN0YWNsZXMuZm9yRWFjaChvYnN0YWNsZSA9PiB7XHJcbiAgICAgICAgb2JzdGFjbGUuZHJhdyhjdHgpO1xyXG4gICAgfSlcclxuICAgIGNsb3VkLmRyYXdXYXRlcihjdHgpO1xyXG5cclxuXHJcbiAgICB3YXRlcmRyb3BzLmZvckVhY2goZHJvcCA9PiB7XHJcbiAgICAgICAgZHJvcC5kcmF3KGN0eCk7XHJcbiAgICB9KVxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShpbml0KTtcclxufVxyXG5cclxuaW5pdCgpXHJcblxyXG4iLCJjbGFzcyBDYW52YXMge1xyXG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRDYW52YXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRDb250ZXh0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldFdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRIZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2V0SGVpZ2h0KGhlaWdodCkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgc2V0V2lkdGgod2lkdGgpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0Q2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcztcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsImNsYXNzIE9ic3RhY2xlIHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIHJhZGl1cykge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcclxuICAgIH1cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPYnN0YWNsZTsiLCJjb25zdCBXYXRlckRyb3AgPSByZXF1aXJlKCcuL3dhdGVyZHJvcCcpO1xyXG5cclxuY2xhc3MgUmFpbkNsb3VkIHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9ic3RhY2xlcykge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy53YXRlcmRyb3BzID0gW107XHJcbiAgICAgICAgdGhpcy5vYnN0YWNsZXMgPSBvYnN0YWNsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVXYXRlcigpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCB4ID0gTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGg7XHJcbiAgICAgICAgICAgIGxldCB5ID0gTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLndhdGVyZHJvcHMucHVzaChuZXcgV2F0ZXJEcm9wKHgsIHksIHRoaXMub2JzdGFjbGVzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdXYXRlcihjdHgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2F0ZXJkcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLndhdGVyZHJvcHNbaV0uZHJhdyhjdHgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYWluQ2xvdWQ7IiwiY2xhc3MgTW91c2Uge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZTsiLCJjb25zdCBjaXJjbGVDaXJjbGUgPSByZXF1aXJlKFwiLi4vbWF0aC9jaXJjbGVjaXJjbGVcIik7XHJcblxyXG5jbGFzcyBXYXRlcmRyb3Age1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgb2JzdGFjbGVzKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gNVxyXG4gICAgICAgIHRoaXMuY29sb3IgPSAnIzAwOTVmZic7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IC4wMTtcclxuICAgICAgICB0aGlzLm9ic3RhY2xlcyA9IG9ic3RhY2xlcztcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0ge1xyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZShjdHgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGN0eCkge1xyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnZlbG9jaXR5LnggLyAyO1xyXG4gICAgICAgIHRoaXMueSArPSB0aGlzLnZlbG9jaXR5LnkgLyAyO1xyXG5cclxuICAgICAgICB0aGlzLnZlbG9jaXR5LnkgKz0gdGhpcy5zcGVlZDtcclxuICAgICAgICBpZiAodGhpcy52ZWxvY2l0eS55ID4gMykge1xyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnkgKj0gLjk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYnN0YWNsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IG9ic3RhY2xlID0gdGhpcy5vYnN0YWNsZXNbaV07XHJcbiAgICAgICAgICAgIGxldCBjYyA9IGNpcmNsZUNpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIG9ic3RhY2xlLngsIG9ic3RhY2xlLnksIG9ic3RhY2xlLnJhZGl1cylcclxuICAgICAgICAgICAgaWYgKGNjKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVDb2xsaXNpb24odGhpcywgb2JzdGFjbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueSArPSB0aGlzLnNwZWVkO1xyXG4gICAgICAgIGlmICh0aGlzLnkgPiBjYW52YXMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IE1hdGgucmFuZG9tKCkgKiBjYW52YXMud2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVzb2x2ZUNvbGxpc2lvbihjMSwgYzIpIHtcclxuICAgICAgICBsZXQgZGlzdGFuY2VfeCA9IGMxLnggLSBjMi54O1xyXG4gICAgICAgIGxldCBkaXN0YW5jZV95ID0gYzEueSAtIGMyLnk7XHJcbiAgICAgICAgbGV0IHJhZGlpX3N1bSA9IGMxLnJhZGl1cyArIGMyLnJhZGl1cztcclxuICAgICAgICBsZXQgbGVuZ3RoID0gTWF0aC5zcXJ0KGRpc3RhbmNlX3ggKiBkaXN0YW5jZV94ICsgZGlzdGFuY2VfeSAqIGRpc3RhbmNlX3kpIHx8IDE7XHJcbiAgICAgICAgbGV0IHVuaXRfeCA9IGRpc3RhbmNlX3ggLyBsZW5ndGg7XHJcbiAgICAgICAgbGV0IHVuaXRfeSA9IGRpc3RhbmNlX3kgLyBsZW5ndGg7XHJcbiAgICAgICAgbGV0IG92ZXJsYXAgPSByYWRpaV9zdW0gLSBsZW5ndGg7XHJcbiAgICAgICAgYzEueCArPSB1bml0X3ggKiBvdmVybGFwIC8gMjtcclxuICAgICAgICBjMS55ICs9IHVuaXRfeSAqIG92ZXJsYXAgLyAyO1xyXG4gICAgICAgIHJldHVybiBvdmVybGFwO1xyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gV2F0ZXJkcm9wOyJdfQ==
