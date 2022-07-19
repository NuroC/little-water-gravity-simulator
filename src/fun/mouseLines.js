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