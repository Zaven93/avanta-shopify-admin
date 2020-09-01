export const toCurrency = (price) => {
    return new Intl.NumberFormat('hy-AM', {
        currency: 'AMD',
        style: 'currency'
    }).format(price)
}
