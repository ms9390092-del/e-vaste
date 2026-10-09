const STORAGE_KEY = 'ecycle_items'

export function getStoredItems() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveStoredItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save items:', error)
  }
}

export function addStoredItem(item) {
  const items = getStoredItems()
  const newItem = {
    ...item,
    id: item.id || crypto.randomUUID(),
    createdAt: item.createdAt || new Date().toISOString()
  }
  saveStoredItems([newItem, ...items])
  return newItem
}

export function updateStoredItem(id, updates) {
  const items = getStoredItems()
  const index = items.findIndex(i => i.id === id)
  if (index !== -1) {
    items[index] = { ...items[index], ...updates }
    saveStoredItems(items)
    return items[index]
  }
  return null
}

export function deleteStoredItem(id) {
  const items = getStoredItems()
  const filtered = items.filter(i => i.id !== id)
  saveStoredItems(filtered)
}

export function getItemCount() {
  return getStoredItems().length
}