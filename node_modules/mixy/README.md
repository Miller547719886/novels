# mixy
Sugar methods to manipulate objects.

[![version](https://img.shields.io/npm/v/mixy.svg)](https://www.npmjs.org/package/mixy)
[![status](https://travis-ci.org/zoubin/mixy.svg?branch=master)](https://travis-ci.org/zoubin/mixy)
[![coverage](https://img.shields.io/coveralls/zoubin/mixy.svg)](https://coveralls.io/github/zoubin/mixy)
[![devDependencies](https://david-dm.org/zoubin/mixy/dev-status.svg)](https://david-dm.org/zoubin/mixy#info=devDependencies)

## Methods

```javascript
var mixy = require('mixy')
// actually `mix === mixy`
var mix = mixy.mix

```

### r = mix(r, ...sources)
Mix own properties from all `sources` into the receiver object `r`.

```javascript
var o = { x: 1 }
mix(o, { x: 2 }, null, { y: 3 }, { x: 4 })
// o == { x: 4, y: 3 }

```

### r = fill(r, defaults)
Mix own properties from `defaults` into the receiver object `r`, except those `r` already owns.

```javascript
var o = { x: 1, y: 2, z: null, w: undefined }
fill(o, { x: 2, z: 3, w: 4, a: null, b: undefined })
// o == { x: 1, y: 2, z: null, w: undefined, a: null, b: undefined }

```

### o = pick(keys, ...sources)
Pick properties specified in `keys` from `sources` to create the returned object.

```javascript
var o = pick(['x', 'y'], { x: 1, y: 2 }, null, { x: 3 })
// o == { x: 3, y: 2 }

o = pick('x', { x: 1, y: 2 }, { x: 3 })
// o == { x: 3 }

```

### o = exclude(keys, ...sources)
Pick properties except thos specified in `keys` from `sources` to create the returned object.

```javascript
var o = exclude('y', { x: 1, y: 2 }, null, { x: 3 })
// o == { x: 3 }

o = exclude(['x', 'y'], { x: 1, y: 2, z: 3 }, { x: 3, z: 4 })
// o == { z: 4 }

```

### o = del(keys, target)
Delete `keys` from `target`,
and return a new object containing those deleted `key-value`s.
If none is deleted, `null` will be returned.

```javascript
var o = del('y', { x: 1, y: 2 })
// o == { y: 2 }

var o = del('z', { x: 1, y: 2 })
// o == null

o = del(['x', 'y'], { x: 1, y: 2, z: 3 })
// o == { x: 1, y: 2 }

```

