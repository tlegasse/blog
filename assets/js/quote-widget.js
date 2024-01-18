document.addEventListener('DOMContentLoaded', function() {
    const quoteList = document.getElementById('quote-list')
    const quotes = quoteList.querySelectorAll('p')

    const quoteCount = quotes.length
    const randomQuote = quotes[Math.floor(Math.random() * quoteCount)]

    for (const quote of quotes) {
        quote.classList.add('hidden')
    }

    randomQuote.classList.remove('hidden')
})
