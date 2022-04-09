/**
 * Unit8Array 转 String
 * @param {Unit8Array} u8a 需要传入 Unit8Array
 * @returns {String} 返回一个 String
 */
const u8aToString = (u8a) => {
  let result = ''
  u8a.forEach((item, i, items) => {
    result += String.fromCharCode(items[i])
  })
  return result
}

/**
 * String 转 Unit8Array
 * @param {String} str 需要传入 String
 * @returns {Unit8Array} 返回一个 Unit8Array
 */
const stringToU8a = (str) => {
  const result = []
  for (let i = 0, len = str.length; i < len; i++) {
    result.push(str.charCodeAt(i))
  }
  return new Uint8Array(result)
}

export { u8aToString, stringToU8a }
