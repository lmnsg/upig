const baseUrl = `ws://${location.host}`

export const open = (url) => new window.WebSocket(baseUrl + url)
