function _clean(piece: string) {
  return piece
    .replace(/((^|\n)(?:[^\/\\]|\/[^*\/]|\\.)*?)\s*\/\*(?:[^*]|\*[^\/])*(\*\/|)/g, '$1')
    .replace(/((^|\n)(?:[^\/\\]|\/[^\/]|\\.)*?)\s*\/\/[^\n]*/g, '$1')
    .replace(/\n\s*/g, '')
}

function regex({ raw }: { raw: string[] }, ...interpolations: string[]) {
  return new RegExp(
    interpolations.reduce((regex, insert, index) => regex + insert + _clean(raw[index + 1]), _clean(raw[0])),
    'gmi'
  )
}

export default regex
