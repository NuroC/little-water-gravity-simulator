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
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.velocity.y += this.speed;
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