const { createItem, getAllItems, getItem, updateItem, deleteItem } = require('./controller')

function handleRoutes(req, res) {
  const urlParts = req.url.split('/').filter(Boolean) // ["items", "id"]
  const method = req.method

    if (method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome to my INVENTORY API server!');
    }

    else{
        if (urlParts[0] === 'items') {
    if (method === 'GET' && urlParts.length === 1) {
      return getAllItems(req, res)
    }

    if (method === 'POST' && urlParts.length === 1) {
      return parseBody(req, (body) => createItem(req, res, body))
    }

    if (urlParts.length === 2) {
      const id = urlParts[1]

      if (method === 'GET') return getItem(req, res, id)
      if (method === 'PUT') return parseBody(req, (body) => updateItem(req, res, id, body))
      if (method === 'DELETE') return deleteItem(req, res, id)
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ success: false, message: 'Route not found' }))
}
    }

// Helper to parse JSON body
function parseBody(req, callback) {
  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body || '{}')
      callback(parsed)
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, message: 'Invalid JSON body' }))
    }
  })
}

module.exports = handleRoutes
