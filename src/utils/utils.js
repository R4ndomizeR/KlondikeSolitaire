export const utils = {
  getX(index, columns) {
    return index % columns
  },

  getY(index, columns) {
    return parseInt(index / columns)
  },

  getPosFromXY(x, y, columns) {
    return columns * y + x
  },

  getRandom: (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min // return [min, max)
  },

  getRandomArray: (intMin, intMax, count) => {
    let counter = 0

    const arr = []

    while (counter < count) {
      const pos = utils.getRandom(intMin, intMax)

      if (arr.includes(pos)) continue

      arr.push(pos)
      counter++
    }

    return arr
  },

  getDistance(x1, y1, x2, y2) {
    let y = x2 - x1
    let x = y2 - y1

    return Math.sqrt(x * x + y * y)
  },

  forEachArround(index, rows, columns, callback) {
    const x = utils.getX(index, columns)
    const y = utils.getY(index, columns)

    if (x - 1 >= 0)
      callback(x - 1, y)
    if (x + 1 < columns)
      callback(x + 1, y)
    if (y - 1 >= 0)
      callback(x, y - 1)
    if (y + 1 < rows)
      callback(x, y + 1)

    if (x - 1 >= 0 && y - 1 >= 0)
      callback(x - 1, y - 1)
    if (x - 1 >= 0 && y + 1 < rows)
      callback(x - 1, y + 1)
    if (x + 1 < columns && y + 1 < rows)
      callback(x + 1, y + 1)
    if (x + 1 < columns && y - 1 >= 0)
      callback(x + 1, y - 1)
  },

  inInterval(min, max, value) {
    if (value < min || value >= max) return false
    return true
  }
}