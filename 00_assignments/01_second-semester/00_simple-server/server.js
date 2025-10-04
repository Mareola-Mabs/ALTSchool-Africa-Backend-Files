const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const PORT = 3000
const PUBLIC_DIR = path.join(__dirname, 'public')

// Basic MIME type mapping
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain'
}

function sendFile(res, filepath, statusCode = 200, contentType = 'text/plain; charset=utf-8') {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Internal Server Error')
      return
    }
    res.writeHead(statusCode, { 'Content-Type': contentType })
    res.end(data)
  })
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url)
  let pathname = decodeURIComponent(parsed.pathname || '/')

  // Normalize path to prevent traversal
  let safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '')

  if (safePath === '/' || safePath === '') {
    safePath = '/index.html'
  }

  const requested = path.join(PUBLIC_DIR, safePath)
  const ext = path.extname(requested).toLowerCase()
  const contentType = mimeTypes[ext] || 'application/octet-stream'

  // Make sure request stays inside PUBLIC_DIR
  if (!requested.startsWith(PUBLIC_DIR)) {
    const notFoundPath = path.join(PUBLIC_DIR, '404.html')
    return sendFile(res, notFoundPath, 404, 'text/html; charset=utf-8')
  }

  fs.access(requested, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn’t exist
      if (ext === '.html') {
        const notFoundPath = path.join(PUBLIC_DIR, '404.html')
        sendFile(res, notFoundPath, 404, 'text/html; charset=utf-8')
      } else {
        const notFoundPath = path.join(PUBLIC_DIR, '404.html')
        sendFile(res, notFoundPath, 404, 'text/html; charset=utf-8')
      }
    } else {
      sendFile(res, requested, 200, contentType)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})