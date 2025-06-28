(() => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('c3');
    const canvasDims = canvas.getBoundingClientRect()
    canvas.width = canvasDims.width
    canvas.height = canvasDims.height

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    const inputStr = "Hello world"

    const timeCoefficient = 400

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)

    const getFrame = (timestamp) => {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)

        ctx.fillStyle = "#000000"
        ctx.font = "32px monospace";


        for (const key in inputStr) {
            const vOffset = Math.sin((timestamp + (key * 360)) / timeCoefficient) * 25
            ctx.fillText(inputStr[key], key * 25 + 15, (canvasDims.height / 2) + vOffset);
        }

        requestAnimationFrame(getFrame)
    }

    requestAnimationFrame(getFrame)
})()
