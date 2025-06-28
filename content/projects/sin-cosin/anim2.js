(() => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('c2');
    const canvasDims = canvas.getBoundingClientRect()
    canvas.width = canvasDims.width
    canvas.height = canvasDims.height

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    const timeCoefficient = 600

    ctx.fillStyle = "#f1f1f1"
    ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)

    const getFrame = (timestamp) => {
        ctx.fillStyle = "#f1f1f129"
        ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)

        const rad = 50

        // Calculating the angular 
        const particlePX = Math.cos(timestamp / timeCoefficient * 8) * (rad / 2)
        const particlePY = Math.sin(timestamp / timeCoefficient * 8) * (rad / 2)

        // calculating the x and y of the point based on radius
        const pX = (Math.cos(timestamp / (timeCoefficient)) * rad) + canvasDims.width / 2
        const pY = (Math.sin(timestamp / (timeCoefficient)) * rad) + canvasDims.height / 2

        ctx.beginPath();
        ctx.fillStyle = '#eeb549'
        ctx.arc(pX + particlePX, pY + particlePY, 8, 0, 2 * Math.PI);
        ctx.closePath()
        ctx.fill()

        ctx.beginPath();
        ctx.fillStyle = '#00beff'
        ctx.arc(pX, pY, 8, 0, 2 * Math.PI);
        ctx.closePath()
        ctx.fill()
        requestAnimationFrame(getFrame)
    }

    requestAnimationFrame(getFrame)
})()
