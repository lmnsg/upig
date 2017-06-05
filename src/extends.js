exports.extendWS = (WS) => {
  WS.prototype.sendJSON = function(data) {
    this.send(JSON.stringify(data))
  }
}
