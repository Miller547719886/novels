exports = module.exports = mix
exports.mix = mix
exports.fill = fill
exports.pick = pick
exports.exclude = exclude
exports.del = del
exports.each = each

function mix() {
  return Array.prototype.reduce.call(arguments, function (ret, o) {
    each(o, function (v, k) {
      ret[k] = v
    })
    return ret
  })
}

function fill(o, def) {
  if (o == null) return o
  each(def, function (v, k) {
    if (!has(o, k)) o[k] = v
  })
  return o
}

function has(o, k) {
  return o == null ? false : Object.prototype.hasOwnProperty.call(o, k)
}

function each(o, fn, context) {
  context = arguments.length > 2 ? context : o
  if (o == null) return
  for (var k in o) {
    if (has(o, k)) fn.call(context, o[k], k, o)
  }
}

function del(keys, o) {
  return [].concat(keys).reduce(function (deleted, k) {
    if (has(o, k)) {
      deleted = deleted || {}
      deleted[k] = o[k]
      delete o[k]
    }
    return deleted
  }, null)
}

function pick(keys) {
  var sources = slice(arguments, 1)
  return [].concat(keys).reduce(function (ret, k) {
    sources.forEach(function (o) {
      if (has(o, k)) ret[k] = o[k]
    })
    return ret
  }, {})
}

function exclude(keys) {
  var ret = mix.bind(null, {}).apply(null, slice(arguments, 1))
  del(keys, ret)
  return ret
}

function slice(o, from, to) {
  return Array.prototype.slice.call(o, from, to)
}

