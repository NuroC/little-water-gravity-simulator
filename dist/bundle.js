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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnVuL21vdXNlTGluZXMuanMiLCJzcmMvbWF0aC9jaXJjbGVjaXJjbGUuanMiLCJzcmMvc2NyaXB0LmpzIiwic3JjL3N0cnVjdHVyZS9DYW52YXMuanMiLCJzcmMvc3RydWN0dXJlL09ic3RhY2xlLmpzIiwic3JjL3N0cnVjdHVyZS9SYWluQ2xvdWQuanMiLCJzcmMvc3RydWN0dXJlL21vdXNlLmpzIiwic3JjL3N0cnVjdHVyZS93YXRlcmRyb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBNb3VzZUxpbmVzIHtcclxuICAgIHN0YXRpYyBkcmF3KGN0eCwgTW91c2UpIHtcclxuXHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aClcclxuICAgICAgICBjdHgubGluZVRvKE1vdXNlLngsIE1vdXNlLnkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmFyYyhNb3VzZS54LCBNb3VzZS55LCAxMCwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW91c2VMaW5lczsiLCIndXNlIHN0cmljdCdcclxuXHJcbi8qKlxyXG4gKiBjaXJjbGUtY2lyY2xlIGNvbGxpc2lvblxyXG4gKiBAcGFyYW0ge251bWJlcn0geDEgY2VudGVyIG9mIGNpcmNsZSAxXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSBjZW50ZXIgb2YgY2lyY2xlIDFcclxuICogQHBhcmFtIHtudW1iZXJ9IHIxIHJhZGl1cyBvZiBjaXJjbGUgMVxyXG4gKiBAcGFyYW0ge251bWJlcn0geDIgY2VudGVyIG9mIGNpcmNsZSAyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MiBjZW50ZXIgb2YgY2lyY2xlIDJcclxuICogQHBhcmFtIHtudW1iZXJ9IHIyIHJhZGl1cyBvZiBjaXJjbGUgMlxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjaXJjbGVDaXJjbGUoeDEsIHkxLCByMSwgeDIsIHkyLCByMikge1xyXG4gICAgdmFyIHggPSB4MSAtIHgyXHJcbiAgICB2YXIgeSA9IHkyIC0geTFcclxuICAgIHZhciByYWRpaSA9IHIxICsgcjJcclxuICAgIHJldHVybiB4ICogeCArIHkgKiB5IDw9IHJhZGlpICogcmFkaWlcclxufSIsImNvbnN0IENhbnZhcyA9IHJlcXVpcmUoJy4vc3RydWN0dXJlL0NhbnZhcycpO1xyXG5jb25zdCBNb3VzZSA9IHJlcXVpcmUoJy4vc3RydWN0dXJlL21vdXNlJyk7XHJcbmNvbnN0IFJhaW5DbG91ZCA9IHJlcXVpcmUoJy4vc3RydWN0dXJlL1JhaW5DbG91ZCcpO1xyXG5jb25zdCBNb3VzZUxpbmVzID0gcmVxdWlyZShcIi4vZnVuL21vdXNlTGluZXNcIik7XHJcbmNvbnN0IE9ic3RhY2xlID0gcmVxdWlyZSgnLi9zdHJ1Y3R1cmUvT2JzdGFjbGUnKTtcclxuY29uc3QgV2F0ZXJEcm9wID0gcmVxdWlyZSgnLi9zdHJ1Y3R1cmUvd2F0ZXJkcm9wJyk7XHJcbmNvbnN0IGNhbnZhcyA9IG5ldyBDYW52YXMoMTkyMCwgMTA4MCk7XHJcblxyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgpO1xyXG52YXIgT2JzdGFjbGVzID0gW1xyXG4gICAgbmV3IE9ic3RhY2xlKDUwMCwgNjAwLCAxMDApLFxyXG4gICAgbmV3IE9ic3RhY2xlKDIwMCwgNjAwLCAxMDApLCAgXHJcbiAgICBuZXcgT2JzdGFjbGUoODAwLCA2MDAsIDEwMCksXHJcbiAgICBuZXcgT2JzdGFjbGUoMTEwMCwgNjAwLCAxMDApLFxyXG5cclxuXVxyXG5jb25zdCBjbG91ZCA9IG5ldyBSYWluQ2xvdWQoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LCBPYnN0YWNsZXMpO1xyXG5sZXQgd2F0ZXJkcm9wcyA9IFtdXHJcbmNsb3VkLmdlbmVyYXRlV2F0ZXIoKTtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgTW91c2UueCA9IGUuY2xpZW50WDtcclxuICAgIE1vdXNlLnkgPSBlLmNsaWVudFk7XHJcbiAgICAvLyBsZXQgZHJvcCA9IG5ldyBXYXRlckRyb3AoTW91c2UueCwgTW91c2UueSwgT2JzdGFjbGVzKTtcclxuICAgIC8vIHdhdGVyZHJvcHMucHVzaChkcm9wKTtcclxuICAgIC8vIGlmKHdhdGVyZHJvcHMubGVuZ3RoID4gMjAwMCkge1xyXG4gICAgLy8gICAgIHdhdGVyZHJvcHMuc2hpZnQoKTtcclxuICAgIC8vIH1cclxufSlcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcclxuICAgIC8vIGRlbGV0ZSB0aGUgbmVhcmVzdCBvYnN0YWNsZSBvbiBsZWZ0IGNsaWNrXHJcbiAgICBpZiAoZS5idXR0b24gPT09IDApIHtcclxuICAgICAgICBsZXQgbmVhcmVzdE9ic3RhY2xlID0gT2JzdGFjbGVzLnJlZHVjZSgobmVhcmVzdCwgb2JzdGFjbGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KG9ic3RhY2xlLnggLSBNb3VzZS54LCAyKSArIE1hdGgucG93KG9ic3RhY2xlLnkgLSBNb3VzZS55LCAyKSk7XHJcbiAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IG5lYXJlc3QuZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIG5lYXJlc3QuZGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICAgICAgICAgIG5lYXJlc3Qub2JzdGFjbGUgPSBvYnN0YWNsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmVhcmVzdDtcclxuICAgICAgICB9LCB7IGRpc3RhbmNlOiBJbmZpbml0eSwgb2JzdGFjbGU6IG51bGwgfSk7XHJcbiAgICAgICAgaWYgKG5lYXJlc3RPYnN0YWNsZS5vYnN0YWNsZSkge1xyXG4gICAgICAgICAgICBPYnN0YWNsZXMuc3BsaWNlKE9ic3RhY2xlcy5pbmRleE9mKG5lYXJlc3RPYnN0YWNsZS5vYnN0YWNsZSksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIE9ic3RhY2xlcy5wdXNoKG5ldyBPYnN0YWNsZShlLmNsaWVudFgsIGUuY2xpZW50WSwgMTAwKSk7XHJcbn0pXHJcblxyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcblxyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4Lm1vdmVUbygwLCAwKTtcclxuICAgIGN0eC5saW5lVG8oY2FudmFzLndpZHRoLCAwKTtcclxuICAgIGN0eC5saW5lVG8oY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIGN0eC5saW5lVG8oMCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICBjdHgubGluZVRvKDAsIDApO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgIFxyXG4gICAgT2JzdGFjbGVzLmZvckVhY2gob2JzdGFjbGUgPT4ge1xyXG4gICAgICAgIG9ic3RhY2xlLmRyYXcoY3R4KTtcclxuICAgIH0pXHJcbiAgICBjbG91ZC5kcmF3V2F0ZXIoY3R4KTtcclxuXHJcblxyXG4gICAgd2F0ZXJkcm9wcy5mb3JFYWNoKGRyb3AgPT4ge1xyXG4gICAgICAgIGRyb3AuZHJhdyhjdHgpO1xyXG4gICAgfSlcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaW5pdCk7XHJcbn1cclxuXHJcbmluaXQoKVxyXG5cclxuIiwiY2xhc3MgQ2FudmFzIHtcclxuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0Q2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0Q29udGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0SGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuICAgIHNldEhlaWdodChoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuICAgIHNldFdpZHRoKHdpZHRoKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldENhbnZhcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXM7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbnZhczsiLCJjbGFzcyBPYnN0YWNsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCByYWRpdXMpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT2JzdGFjbGU7IiwiY29uc3QgV2F0ZXJEcm9wID0gcmVxdWlyZSgnLi93YXRlcmRyb3AnKTtcclxuXHJcbmNsYXNzIFJhaW5DbG91ZCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvYnN0YWNsZXMpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMud2F0ZXJkcm9wcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub2JzdGFjbGVzID0gb2JzdGFjbGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlV2F0ZXIoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDA7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgeCA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoO1xyXG4gICAgICAgICAgICBsZXQgeSA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy53YXRlcmRyb3BzLnB1c2gobmV3IFdhdGVyRHJvcCh4LCB5LCB0aGlzLm9ic3RhY2xlcykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3V2F0ZXIoY3R4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhdGVyZHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy53YXRlcmRyb3BzW2ldLmRyYXcoY3R4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRXYXRlcnJEZWJ1Z0luZm8oKSB7XHJcbiAgICAgICAgbGV0IGF2Z1ZlbG9jaXR5ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2F0ZXJkcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhdmdWZWxvY2l0eSArPSB0aGlzLndhdGVyZHJvcHNbaV0udmVsb2NpdHkueTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJhaW5DbG91ZDsiLCJjbGFzcyBNb3VzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vdXNlOyIsImNvbnN0IGNpcmNsZUNpcmNsZSA9IHJlcXVpcmUoXCIuLi9tYXRoL2NpcmNsZWNpcmNsZVwiKTtcclxuXHJcbmNsYXNzIFdhdGVyZHJvcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBvYnN0YWNsZXMpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSA1XHJcbiAgICAgICAgdGhpcy5jb2xvciA9ICcjMDA5NWZmJztcclxuICAgICAgICB0aGlzLnNwZWVkID0gLjAxO1xyXG4gICAgICAgIHRoaXMub2JzdGFjbGVzID0gb2JzdGFjbGVzO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB7XHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKGN0eCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY3R4KSB7XHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMudmVsb2NpdHkueCAvIDI7XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMudmVsb2NpdHkueSAvIDI7XHJcblxyXG4gICAgICAgIHRoaXMudmVsb2NpdHkueSArPSB0aGlzLnNwZWVkO1xyXG4gICAgICAgIGlmICh0aGlzLnZlbG9jaXR5LnkgPiAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkueSAqPSAuOTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9ic3RhY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb2JzdGFjbGUgPSB0aGlzLm9ic3RhY2xlc1tpXTtcclxuICAgICAgICAgICAgbGV0IGNjID0gY2lyY2xlQ2lyY2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgb2JzdGFjbGUueCwgb2JzdGFjbGUueSwgb2JzdGFjbGUucmFkaXVzKVxyXG4gICAgICAgICAgICBpZiAoY2MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUNvbGxpc2lvbih0aGlzLCBvYnN0YWNsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMuc3BlZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMueSA+IGNhbnZhcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKSAqIGNhbnZhcy53aWR0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXNvbHZlQ29sbGlzaW9uKGMxLCBjMikge1xyXG4gICAgICAgIGxldCBkaXN0YW5jZV94ID0gYzEueCAtIGMyLng7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlX3kgPSBjMS55IC0gYzIueTtcclxuICAgICAgICBsZXQgcmFkaWlfc3VtID0gYzEucmFkaXVzICsgYzIucmFkaXVzO1xyXG4gICAgICAgIGxldCBsZW5ndGggPSBNYXRoLnNxcnQoZGlzdGFuY2VfeCAqIGRpc3RhbmNlX3ggKyBkaXN0YW5jZV95ICogZGlzdGFuY2VfeSkgfHwgMTtcclxuICAgICAgICBsZXQgdW5pdF94ID0gZGlzdGFuY2VfeCAvIGxlbmd0aDtcclxuICAgICAgICBsZXQgdW5pdF95ID0gZGlzdGFuY2VfeSAvIGxlbmd0aDtcclxuICAgICAgICBsZXQgb3ZlcmxhcCA9IHJhZGlpX3N1bSAtIGxlbmd0aDtcclxuICAgICAgICBjMS54ICs9IHVuaXRfeCAqIG92ZXJsYXAgLyAyO1xyXG4gICAgICAgIGMxLnkgKz0gdW5pdF95ICogb3ZlcmxhcCAvIDI7XHJcbiAgICAgICAgcmV0dXJuIG92ZXJsYXA7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBXYXRlcmRyb3A7Il19
