const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(__dirname, 'items.json')

// Utility: read JSON file safely
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.error('Error reading data:', err)
    return []
  }
}

// Utility: write JSON file safely
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing data:', err)
  }
}

// Utility: send JSON response
function sendJSON(res, statusCode, success, message, data = null) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ success, message, data }))
}

module.exports = { readData, writeData, sendJSON }
