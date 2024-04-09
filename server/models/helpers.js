function getDateYYYYMMDD(date) {
    function twoDigits(numString) {
        return numString < 10 ? "0" + numString : "" + numString
    }

    const day = twoDigits(date.getDate())
    const month = twoDigits(date.getMonth() + 1)
    const year = twoDigits(date.getFullYear())

    return `${year}-${month}-${day}`
}

module.exports = { getDateYYYYMMDD }
