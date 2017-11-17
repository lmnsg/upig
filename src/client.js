const baseUrl = `wss://${location.host}/ws`

export const open = (url) => new window.WebSocket(baseUrl + url)
