(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "bit_array\n=========\n\nA Bit Array for JS\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Bit Array\n=========\n\nExperiment to store an array of 1-bit data and serialize back and forth from JSON.\n\n    {ceil} = Math\n\n    n = 8\n\n    masks = [\n      0b00000001\n      0b00000010\n      0b00000100\n      0b00001000\n      0b00010000\n      0b00100000\n      0b01000000\n      0b10000000\n    ]\n\n    inverseMasks = masks.map (mask) ->\n      ~mask & 0xff\n\n    module.exports = (sizeOrData) ->\n      if typeof sizeOrData is \"string\"\n        view = deserialize(sizeOrData)\n      else\n        buffer = new ArrayBuffer(ceil(sizeOrData/n))\n        view = new Uint8Array(buffer)\n\n      self =\n        get: (i) ->\n          byteIndex = i >> 3\n          offset = i % n\n\n          if (value = view[byteIndex])?\n            return (value & masks[offset]) >> offset\n\n        set: (i, value) ->\n          byteIndex = i >> 3\n          offset = i % n\n\n          view[byteIndex] = ((value << offset) & masks[offset]) | (view[byteIndex] & inverseMasks[offset])\n\n          return self.get(i)\n\n        size: ->\n          view.length * 8\n\n        toJSON: ->\n          serialize(view)\n\n    mimeType = \"application/octet-binary\"\n\n    deserialize = (dataURL) ->\n      dataString = dataURL.substring(dataURL.indexOf(';') + 1)\n\n      binaryString = atob(dataString)\n      length =  binaryString.length\n\n      buffer = new ArrayBuffer length\n\n      view = new Uint8Array(buffer)\n\n      i = 0\n      while i < length\n        view[i] = binaryString.charCodeAt(i)\n        i += 1\n\n      return view\n\n    serialize = (bytes) ->\n      binary = ''\n      length = bytes.byteLength\n\n      i = 0\n      while i < length\n        binary += String.fromCharCode(bytes[i])\n        i += 1\n\n      \"data:#{mimeType};#{btoa(binary)}\"\n\n    serializeAsync = (buffer, cb) ->\n      reader = new FileReader()\n\n      reader.onloadend = ->\n        cb reader.result\n\n      reader.readAsDataURL new Blob [buffer],\n        type: mimeType\n\n      return\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.1\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/main.coffee": {
      "path": "test/main.coffee",
      "content": "BitArray = require \"../main\"\n\ntestPattern = (n) ->\n  bitArray = BitArray(256)\n\n  [0...256].forEach (i) ->\n    bitArray.set(i, i % n is 0)\n\n  reloadedArray = BitArray(bitArray.toJSON())\n\n  [0...256].forEach (i) ->\n    test = 0 | (i % n is 0)\n    assert.equal reloadedArray.get(i), test, \"Bit #{i} is #{test}\"\n\ndescribe \"BitArray\", ->\n  it \"should be empty to start\", ->\n    bitArray = BitArray(256)\n\n    [0...256].forEach (i) ->\n      assert.equal bitArray.get(i), 0\n\n  it \"should be able to set and get bits\", ->\n    bitArray = BitArray(256)\n\n    [0...256].forEach (i) ->\n      bitArray.set(i, 1)\n\n    [0...256].forEach (i) ->\n      assert.equal bitArray.get(i), 1\n\n  it \"should be serializable and deserializable\", ->\n    bitArray = BitArray(256)\n\n    [0...256].forEach (i) ->\n      bitArray.set(i, 1)\n\n    reloadedArray = BitArray(bitArray.toJSON())\n\n    [0...256].forEach (i) ->\n      assert.equal reloadedArray.get(i), 1, \"Bit #{i} is 1\"\n\n  it \"should be serializable and deserializable with various patterns\", ->\n    testPattern(1)\n    testPattern(2)\n    testPattern(3)\n    testPattern(4)\n    testPattern(5)\n    testPattern(7)\n    testPattern(11)\n    testPattern(32)\n    testPattern(63)\n    testPattern(64)\n    testPattern(77)\n    testPattern(128)\n\n  # Some may wish for this to throw an error, but normal JS arrays don't\n  # and by default neither do typed arrays so this is just 'going with the flow'\n  it \"should silently discard setting out of range values\", ->\n    bitArray = BitArray(8)\n\n    assert.equal bitArray.set(9, 1), undefined\n    assert.equal bitArray.get(9), undefined\n\n  it \"should know its size\", ->\n    bitArray = BitArray(128)\n\n    assert.equal bitArray.size(), 128\n\n  it \"shouldn't be too big when serializing as json\", ->\n    bitLength = 2048\n    bitArray = BitArray(bitLength)\n\n    serializedLength = bitArray.toJSON().length\n\n    n = 4\n    assert serializedLength < bitLength / n, \"Serialized length < bit length divided by #{n} : #{serializedLength} < #{bitLength / n}\"\n\n\n  it \"should be sized exactly\"\n  -> # PENDING\n    bitArray = BitArray(127)\n\n    assert.equal bitArray.size(), 127\n\n  it \"should be exactly to the bit in length\"\n  # Pending, we'd need to store an extra 3-bits (probably as 1 byte) to hold the\n  # offset from largest byte and read it out and back when serializing\n  ->\n    bitArray = BitArray(9)\n\n    assert.equal bitArray.set(10, 1), undefined\n    assert.equal bitArray.get(10), undefined\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var ceil, deserialize, inverseMasks, masks, mimeType, n, serialize, serializeAsync;\n\n  ceil = Math.ceil;\n\n  n = 8;\n\n  masks = [0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80];\n\n  inverseMasks = masks.map(function(mask) {\n    return ~mask & 0xff;\n  });\n\n  module.exports = function(sizeOrData) {\n    var buffer, self, view;\n    if (typeof sizeOrData === \"string\") {\n      view = deserialize(sizeOrData);\n    } else {\n      buffer = new ArrayBuffer(ceil(sizeOrData / n));\n      view = new Uint8Array(buffer);\n    }\n    return self = {\n      get: function(i) {\n        var byteIndex, offset, value;\n        byteIndex = i >> 3;\n        offset = i % n;\n        if ((value = view[byteIndex]) != null) {\n          return (value & masks[offset]) >> offset;\n        }\n      },\n      set: function(i, value) {\n        var byteIndex, offset;\n        byteIndex = i >> 3;\n        offset = i % n;\n        view[byteIndex] = ((value << offset) & masks[offset]) | (view[byteIndex] & inverseMasks[offset]);\n        return self.get(i);\n      },\n      size: function() {\n        return view.length * 8;\n      },\n      toJSON: function() {\n        return serialize(view);\n      }\n    };\n  };\n\n  mimeType = \"application/octet-binary\";\n\n  deserialize = function(dataURL) {\n    var binaryString, buffer, dataString, i, length, view;\n    dataString = dataURL.substring(dataURL.indexOf(';') + 1);\n    binaryString = atob(dataString);\n    length = binaryString.length;\n    buffer = new ArrayBuffer(length);\n    view = new Uint8Array(buffer);\n    i = 0;\n    while (i < length) {\n      view[i] = binaryString.charCodeAt(i);\n      i += 1;\n    }\n    return view;\n  };\n\n  serialize = function(bytes) {\n    var binary, i, length;\n    binary = '';\n    length = bytes.byteLength;\n    i = 0;\n    while (i < length) {\n      binary += String.fromCharCode(bytes[i]);\n      i += 1;\n    }\n    return \"data:\" + mimeType + \";\" + (btoa(binary));\n  };\n\n  serializeAsync = function(buffer, cb) {\n    var reader;\n    reader = new FileReader();\n    reader.onloadend = function() {\n      return cb(reader.result);\n    };\n    reader.readAsDataURL(new Blob([buffer], {\n      type: mimeType\n    }));\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.1\"};",
      "type": "blob"
    },
    "test/main": {
      "path": "test/main",
      "content": "(function() {\n  var BitArray, testPattern;\n\n  BitArray = require(\"../main\");\n\n  testPattern = function(n) {\n    var bitArray, reloadedArray, _i, _j, _results, _results1;\n    bitArray = BitArray(256);\n    (function() {\n      _results = [];\n      for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n      return _results;\n    }).apply(this).forEach(function(i) {\n      return bitArray.set(i, i % n === 0);\n    });\n    reloadedArray = BitArray(bitArray.toJSON());\n    return (function() {\n      _results1 = [];\n      for (_j = 0; _j < 256; _j++){ _results1.push(_j); }\n      return _results1;\n    }).apply(this).forEach(function(i) {\n      var test;\n      test = 0 | (i % n === 0);\n      return assert.equal(reloadedArray.get(i), test, \"Bit \" + i + \" is \" + test);\n    });\n  };\n\n  describe(\"BitArray\", function() {\n    it(\"should be empty to start\", function() {\n      var bitArray, _i, _results;\n      bitArray = BitArray(256);\n      return (function() {\n        _results = [];\n        for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(bitArray.get(i), 0);\n      });\n    });\n    it(\"should be able to set and get bits\", function() {\n      var bitArray, _i, _j, _results, _results1;\n      bitArray = BitArray(256);\n      (function() {\n        _results = [];\n        for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return bitArray.set(i, 1);\n      });\n      return (function() {\n        _results1 = [];\n        for (_j = 0; _j < 256; _j++){ _results1.push(_j); }\n        return _results1;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(bitArray.get(i), 1);\n      });\n    });\n    it(\"should be serializable and deserializable\", function() {\n      var bitArray, reloadedArray, _i, _j, _results, _results1;\n      bitArray = BitArray(256);\n      (function() {\n        _results = [];\n        for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return bitArray.set(i, 1);\n      });\n      reloadedArray = BitArray(bitArray.toJSON());\n      return (function() {\n        _results1 = [];\n        for (_j = 0; _j < 256; _j++){ _results1.push(_j); }\n        return _results1;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(reloadedArray.get(i), 1, \"Bit \" + i + \" is 1\");\n      });\n    });\n    it(\"should be serializable and deserializable with various patterns\", function() {\n      testPattern(1);\n      testPattern(2);\n      testPattern(3);\n      testPattern(4);\n      testPattern(5);\n      testPattern(7);\n      testPattern(11);\n      testPattern(32);\n      testPattern(63);\n      testPattern(64);\n      testPattern(77);\n      return testPattern(128);\n    });\n    it(\"should silently discard setting out of range values\", function() {\n      var bitArray;\n      bitArray = BitArray(8);\n      assert.equal(bitArray.set(9, 1), void 0);\n      return assert.equal(bitArray.get(9), void 0);\n    });\n    it(\"should know its size\", function() {\n      var bitArray;\n      bitArray = BitArray(128);\n      return assert.equal(bitArray.size(), 128);\n    });\n    it(\"shouldn't be too big when serializing as json\", function() {\n      var bitArray, bitLength, n, serializedLength;\n      bitLength = 2048;\n      bitArray = BitArray(bitLength);\n      serializedLength = bitArray.toJSON().length;\n      n = 4;\n      return assert(serializedLength < bitLength / n, \"Serialized length < bit length divided by \" + n + \" : \" + serializedLength + \" < \" + (bitLength / n));\n    });\n    it(\"should be sized exactly\");\n    (function() {\n      var bitArray;\n      bitArray = BitArray(127);\n      return assert.equal(bitArray.size(), 127);\n    });\n    it(\"should be exactly to the bit in length\");\n    return function() {\n      var bitArray;\n      bitArray = BitArray(9);\n      assert.equal(bitArray.set(10, 1), void 0);\n      return assert.equal(bitArray.get(10), void 0);\n    };\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.1",
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/bit_array",
    "homepage": null,
    "description": "A Bit Array for JS",
    "html_url": "https://github.com/distri/bit_array",
    "url": "https://api.github.com/repos/distri/bit_array",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});