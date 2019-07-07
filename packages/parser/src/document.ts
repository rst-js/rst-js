export function Document() {
  this.sections = []
  this.indent = []
}

Document.prototype.addSection = function(style, hasOver) {
  if (hasOver) style += style
  const index = this.sections.indexOf(style)
  if (index === -1) {
    const ret = this.sections.push(style)
    // console.log("add", ret, this.sections)
    return ret
  }

  // console.log("add", index + 1, this.sections)
  return index + 1
}

Document.prototype.popSection = function() {
  const depth = this.sections.length
  this.sections.pop()
  // console.log("pop", depth, this.sections)
  return depth
}

Document.prototype.isSubSection = function(style, hasOver) {
  if (hasOver) style += style
  // console.log("isSubSection", style, this.sections)

  return this.sections.indexOf(style) === -1
}

Document.prototype.pushIndent = function(to) {
  if (this.getCurrentIndent() === to) return
  // console.log("push", to)
  this.indent.push(to)
}

Document.prototype.pullIndent = function(to) {
  // console.log("pull", to)
  const index = this.indent.indexOf(to)
  if (index === -1) return false

  // console.log("pull", this.indent, index)
  this.indent.splice(index + 1, this.indent.length)
  // console.log("pull", this.indent)
  return true
}

Document.prototype.getCurrentIndent = function() {
  return this.indent[this.indent.length - 1] || 0
}

Document.prototype.clearIndent = function() {
  // console.log("clear")
  this.indent = []
}
