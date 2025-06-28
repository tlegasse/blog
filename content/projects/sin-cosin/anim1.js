(() => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('c1');
    const canvasDims = canvas.getBoundingClientRect()
    canvas.width = canvasDims.width
    canvas.height = canvasDims.height

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    const timeCoefficient = 300

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)

    const getFrame = (timestamp) => {
        ctx.fillStyle = "#ffffff29"
        ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)

        const rad = 50

        // calculating the x and y of the point based on radius
        const pX = Math.cos(timestamp / timeCoefficient) * rad
        const pY = Math.sin(timestamp / timeCoefficient) * rad

        ctx.beginPath();
        ctx.fillStyle = '#eeb549'
        ctx.arc(pX + canvasDims.width / 2, pY + canvasDims.height / 2, 8, 0, 2 * Math.PI);
        ctx.closePath()
        ctx.fill()
        requestAnimationFrame(getFrame)
    }

    requestAnimationFrame(getFrame)
})()
