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