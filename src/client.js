const baseUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`

export const open = (url) => new window.WebSocket(baseUrl + url)
