export const storage = {
  setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      localStorage.setItem(key, data)
    }
  },
  getItem(key) {
    let val = localStorage.getItem(key)
    try {
      val = JSON.parse(val)
    } catch (e) {}
    return val
  },
  removeItem: window.localStorage.removeItem,
  clear: localStorage.clear
}
