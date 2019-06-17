export function Document() {
  this.sections = []
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
