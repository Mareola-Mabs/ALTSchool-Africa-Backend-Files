const { readData, writeData, sendJSON } = require('./utils')
const { randomUUID } = require('crypto')

// CREATE item
function createItem(req, res, body) {
  const items = readData()
  const { name, price, size } = body

  if (!name || !price || !['s', 'm', 'l'].includes(size)) {
    return sendJSON(res, 400, false, 'Invalid input: name, price, and size(s/m/l) are required')
  }

  const newItem = { id: randomUUID(), name, price, size }
  items.push(newItem)
  writeData(items)

  sendJSON(res, 201, true, 'Item created successfully', newItem)
}

// GET all items
function getAllItems(req, res) {
  const items = readData()
  if (items.name === "" || !items.name){
  return sendJSON(res, 200, true, 'Items retrieved', "No items in records, kindly add an Item")
  }
  sendJSON(res, 200, true, 'Items retrieved', items)
}

// GET one item
function getItem(req, res, id) {
  const items = readData()
  const item = items.find(i => i.id === id)

  if (!item) return sendJSON(res, 404, false, 'Item not found')
  sendJSON(res, 200, true, 'Item retrieved', item)
}

// UPDATE item
function updateItem(req, res, id, body) {
  const items = readData()
  const index = items.findIndex(i => i.id === id)

  if (index === -1) return sendJSON(res, 404, false, 'Item not found')

  const { name, price, size } = body
  if (name) items[index].name = name
  if (price) items[index].price = price
  if (size && ['s', 'm', 'l'].includes(size)) items[index].size = size

  writeData(items)
  sendJSON(res, 200, true, 'Item updated', items[index])
}

// DELETE item
function deleteItem(req, res, id) {
  const items = readData()
  const index = items.findIndex(i => i.id === id)

  if (index === -1) return sendJSON(res, 404, false, 'Item not found')

  const deleted = items.splice(index, 1)[0]
  writeData(items)
  sendJSON(res, 200, true, 'Item deleted', deleted)
}

module.exports = { createItem, getAllItems, getItem, updateItem, deleteItem }
