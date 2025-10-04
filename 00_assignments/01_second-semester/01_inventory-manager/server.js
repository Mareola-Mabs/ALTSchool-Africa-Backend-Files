const http = require('http')
const handleRoutes = require('./routes')

const PORT = 4000

const server = http.createServer((req, res) => {
  handleRoutes(req, res)
})

server.listen(PORT, () => {
  console.log(`Inventory API running at http://localhost:${PORT}`)
})
