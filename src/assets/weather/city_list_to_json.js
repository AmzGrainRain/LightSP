const fs = require('fs')

const file = fs.readFileSync('./city_list.csv')
const list = file.split('\n')
