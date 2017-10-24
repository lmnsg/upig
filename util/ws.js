export const send = (ws, data) => {
  ws.send(JSON.stringify(data, (key, val) => {
    if (key === 'queue') return Array.from(val)
    return val
  }))
}
