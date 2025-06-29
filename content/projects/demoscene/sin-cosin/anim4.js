(() => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('c4');
    const canvasDims = canvas.getBoundingClientRect()
    canvas.width = canvasDims.width
    canvas.height = canvasDims.height

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d')

    const inputStr = "hello world"

    const timeCoefficient = 400

    ctx.fillStyle = "#f1f1f1"
    ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)

    const getFrame = (timestamp) => {
        ctx.fillStyle = "#f1f1f1"
        ctx.fillRect(0, 0, canvasDims.width, canvasDims.height)


        for (const key in inputStr) {
            const vOffset = Math.sin((timestamp + (key * 360)) / timeCoefficient) * 36

            ctx.font = `${32 + Math.cos((timestamp + (key * 360)) / timeCoefficient) * 16}px monospace`;
            ctx.fillStyle = `hsl(${Math.cos((timestamp + (key * 360)) / timeCoefficient) * 180} ,50%, 50%)`
            ctx.strokeStyle = ctx.fillStyle
            ctx.lineWidth = '8px'
            ctx.fillText(inputStr[key], key * 25 + 15, (canvasDims.height / 2) + vOffset);
        }

        requestAnimationFrame(getFrame)
    }

    requestAnimationFrame(getFrame)
})()
