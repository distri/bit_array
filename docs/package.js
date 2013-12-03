(function(pkg) {
  // Expose a require for our package so scripts can access our modules
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "mode": "100644",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "mode": "100644",
      "content": "bit_array\n=========\n\nA Bit Array for JS\n",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "mode": "100644",
      "content": "Bit Array\n=========\n\nExperiment to store an array of 1-bit data and serialize back and forth from JSON.\n\n    {ceil} = Math\n\n    n = 8\n\n    masks = [\n      0b00000001\n      0b00000010\n      0b00000100\n      0b00001000\n      0b00010000\n      0b00100000\n      0b01000000\n      0b10000000\n    ]\n\n    inverseMasks = masks.map (mask) ->\n      ~mask & 0xff\n\n    module.exports = (sizeOrData) ->\n      if typeof sizeOrData is \"string\"\n        view = deserialize(sizeOrData)\n      else\n        buffer = new ArrayBuffer(ceil(sizeOrData/n))\n        view = new Uint8Array(buffer)\n\n      self =\n        get: (i) ->\n          byteIndex = i >> 3\n          offset = i % n\n\n          return (view[byteIndex] & masks[offset]) >> offset\n\n        set: (i, value) ->\n          byteIndex = i >> 3\n          offset = i % n\n\n          view[byteIndex] = ((value << offset) & masks[offset]) | (view[byteIndex] & inverseMasks[offset])\n\n          return self.get(i)\n\n        toJSON: ->\n          serialize(view)\n\n    mimeType = \"application/octet-binary\"\n\n    deserialize = (dataURL) ->\n      dataString = dataURL.substring(dataURL.indexOf(';') + 1)\n\n      binaryString = atob(dataString)\n      length =  binaryString.length\n\n      buffer = new ArrayBuffer length\n\n      view = new Uint8Array(buffer)\n\n      i = 0\n      while i < length\n        view[i] = binaryString.charCodeAt(i)\n        i += 1\n\n      return view\n\n    serialize = (bytes) ->\n      binary = ''\n      length = bytes.byteLength\n\n      i = 0\n      while i < length\n        binary += String.fromCharCode(bytes[i])\n        i += 1\n\n      \"data:#{mimeType};#{btoa(binary)}\"\n\n    serializeAsync = (buffer, cb) ->\n      reader = new FileReader()\n\n      reader.onloadend = ->\n        cb reader.result\n\n      reader.readAsDataURL new Blob [buffer],\n        type: mimeType\n\n      return\n",
      "type": "blob"
    },
    "test/main.coffee": {
      "path": "test/main.coffee",
      "mode": "100644",
      "content": "BitArray = require \"../main\"\n\ntestPattern = (n) ->\n  bitArray = BitArray(256)\n\n  [0...256].forEach (i) ->\n    bitArray.set(i, i % n is 0)\n\n  reloadedArray = BitArray(bitArray.toJSON())\n\n  [0...256].forEach (i) ->\n    test = 0 | (i % n is 0)\n    assert.equal reloadedArray.get(i), test, \"Bit #{i} is #{test}\"\n\ndescribe \"BitArray\", ->\n  it \"should be empty to start\", ->\n    bitArray = BitArray(256)\n\n    [0...256].forEach (i) ->\n      assert.equal bitArray.get(i), 0\n\n  it \"should be able to set and get bits\", ->\n    bitArray = BitArray(256)\n\n    [0...256].forEach (i) ->\n      bitArray.set(i, 1)\n\n    [0...256].forEach (i) ->\n      assert.equal bitArray.get(i), 1\n\n  it \"should be serializable and deserializable\", ->\n    bitArray = BitArray(256)\n\n    [0...256].forEach (i) ->\n      bitArray.set(i, 1)\n\n    reloadedArray = BitArray(bitArray.toJSON())\n\n    [0...256].forEach (i) ->\n      assert.equal reloadedArray.get(i), 1, \"Bit #{i} is 1\"\n\n  it \"should be serializable and deserializable with various patterns\", ->\n    testPattern(1)\n    testPattern(2)\n    testPattern(3)\n    testPattern(4)\n    testPattern(5)\n    testPattern(7)\n    testPattern(11)\n    testPattern(32)\n    testPattern(63)\n    testPattern(64)\n    testPattern(77)\n    testPattern(128)\n\n  # Some may wish for this to throw an error, but normal JS arrays don't\n  # and by default neither do typed arrays so this is just 'going with the flow'\n  it \"should silently discard setting out of range values\", ->\n    bitArray = BitArray(8)\n\n    assert.equal bitArray.set(9, 1), 0\n    assert.equal bitArray.get(9), 0\n\n  it \"shouldn't be too big when serializing as json\", ->\n    bitLength = 2048\n    bitArray = BitArray(bitLength)\n\n    serializedLength = bitArray.toJSON().length\n\n    n = 4\n    assert serializedLength < bitLength / n, \"Serialized length < bit length divided by #{n} : #{serializedLength} < #{bitLength / n}\"\n\n  it \"should be exactly to the bit in length\"\n  # Pending, we'd need to store an extra 3-bits (probably as 1 byte) to hold the\n  # offset from largest byte and read it out and back when serializing\n  -> \n    bitArray = BitArray(9)\n\n    assert.equal bitArray.set(10, 1), 0\n    assert.equal bitArray.get(10), 0\n",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "version: \"0.1.0\"\n",
      "type": "blob"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var ceil, deserialize, inverseMasks, masks, mimeType, n, serialize, serializeAsync;\n\n  ceil = Math.ceil;\n\n  n = 8;\n\n  masks = [0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80];\n\n  inverseMasks = masks.map(function(mask) {\n    return ~mask & 0xff;\n  });\n\n  module.exports = function(sizeOrData) {\n    var buffer, self, view;\n    if (typeof sizeOrData === \"string\") {\n      view = deserialize(sizeOrData);\n    } else {\n      buffer = new ArrayBuffer(ceil(sizeOrData / n));\n      view = new Uint8Array(buffer);\n    }\n    return self = {\n      get: function(i) {\n        var byteIndex, offset;\n        byteIndex = i >> 3;\n        offset = i % n;\n        return (view[byteIndex] & masks[offset]) >> offset;\n      },\n      set: function(i, value) {\n        var byteIndex, offset;\n        byteIndex = i >> 3;\n        offset = i % n;\n        view[byteIndex] = ((value << offset) & masks[offset]) | (view[byteIndex] & inverseMasks[offset]);\n        return self.get(i);\n      },\n      toJSON: function() {\n        return serialize(view);\n      }\n    };\n  };\n\n  mimeType = \"application/octet-binary\";\n\n  deserialize = function(dataURL) {\n    var binaryString, buffer, dataString, i, length, view;\n    dataString = dataURL.substring(dataURL.indexOf(';') + 1);\n    binaryString = atob(dataString);\n    length = binaryString.length;\n    buffer = new ArrayBuffer(length);\n    view = new Uint8Array(buffer);\n    i = 0;\n    while (i < length) {\n      view[i] = binaryString.charCodeAt(i);\n      i += 1;\n    }\n    return view;\n  };\n\n  serialize = function(bytes) {\n    var binary, i, length;\n    binary = '';\n    length = bytes.byteLength;\n    i = 0;\n    while (i < length) {\n      binary += String.fromCharCode(bytes[i]);\n      i += 1;\n    }\n    return \"data:\" + mimeType + \";\" + (btoa(binary));\n  };\n\n  serializeAsync = function(buffer, cb) {\n    var reader;\n    reader = new FileReader();\n    reader.onloadend = function() {\n      return cb(reader.result);\n    };\n    reader.readAsDataURL(new Blob([buffer], {\n      type: mimeType\n    }));\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
      "type": "blob"
    },
    "test/main": {
      "path": "test/main",
      "content": "(function() {\n  var BitArray, testPattern;\n\n  BitArray = require(\"../main\");\n\n  testPattern = function(n) {\n    var bitArray, reloadedArray, _i, _j, _results, _results1;\n    bitArray = BitArray(256);\n    (function() {\n      _results = [];\n      for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n      return _results;\n    }).apply(this).forEach(function(i) {\n      return bitArray.set(i, i % n === 0);\n    });\n    reloadedArray = BitArray(bitArray.toJSON());\n    return (function() {\n      _results1 = [];\n      for (_j = 0; _j < 256; _j++){ _results1.push(_j); }\n      return _results1;\n    }).apply(this).forEach(function(i) {\n      var test;\n      test = 0 | (i % n === 0);\n      return assert.equal(reloadedArray.get(i), test, \"Bit \" + i + \" is \" + test);\n    });\n  };\n\n  describe(\"BitArray\", function() {\n    it(\"should be empty to start\", function() {\n      var bitArray, _i, _results;\n      bitArray = BitArray(256);\n      return (function() {\n        _results = [];\n        for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(bitArray.get(i), 0);\n      });\n    });\n    it(\"should be able to set and get bits\", function() {\n      var bitArray, _i, _j, _results, _results1;\n      bitArray = BitArray(256);\n      (function() {\n        _results = [];\n        for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return bitArray.set(i, 1);\n      });\n      return (function() {\n        _results1 = [];\n        for (_j = 0; _j < 256; _j++){ _results1.push(_j); }\n        return _results1;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(bitArray.get(i), 1);\n      });\n    });\n    it(\"should be serializable and deserializable\", function() {\n      var bitArray, reloadedArray, _i, _j, _results, _results1;\n      bitArray = BitArray(256);\n      (function() {\n        _results = [];\n        for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return bitArray.set(i, 1);\n      });\n      reloadedArray = BitArray(bitArray.toJSON());\n      return (function() {\n        _results1 = [];\n        for (_j = 0; _j < 256; _j++){ _results1.push(_j); }\n        return _results1;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(reloadedArray.get(i), 1, \"Bit \" + i + \" is 1\");\n      });\n    });\n    it(\"should be serializable and deserializable with various patterns\", function() {\n      testPattern(1);\n      testPattern(2);\n      testPattern(3);\n      testPattern(4);\n      testPattern(5);\n      testPattern(7);\n      testPattern(11);\n      testPattern(32);\n      testPattern(63);\n      testPattern(64);\n      testPattern(77);\n      return testPattern(128);\n    });\n    it(\"should silently discard setting out of range values\", function() {\n      var bitArray;\n      bitArray = BitArray(8);\n      assert.equal(bitArray.set(9, 1), 0);\n      return assert.equal(bitArray.get(9), 0);\n    });\n    it(\"shouldn't be too big when serializing as json\", function() {\n      var bitArray, bitLength, n, serializedLength;\n      bitLength = 2048;\n      bitArray = BitArray(bitLength);\n      serializedLength = bitArray.toJSON().length;\n      n = 4;\n      return assert(serializedLength < bitLength / n, \"Serialized length < bit length divided by \" + n + \" : \" + serializedLength + \" < \" + (bitLength / n));\n    });\n    it(\"should be exactly to the bit in length\");\n    return function() {\n      var bitArray;\n      bitArray = BitArray(9);\n      assert.equal(bitArray.set(10, 1), 0);\n      return assert.equal(bitArray.get(10), 0);\n    };\n  });\n\n}).call(this);\n\n//# sourceURL=test/main.coffee",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\"};",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://strd6.github.io/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "repository": {
    "id": 14902347,
    "name": "bit_array",
    "full_name": "distri/bit_array",
    "owner": {
      "login": "distri",
      "id": 6005125,
      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
      "gravatar_id": null,
      "url": "https://api.github.com/users/distri",
      "html_url": "https://github.com/distri",
      "followers_url": "https://api.github.com/users/distri/followers",
      "following_url": "https://api.github.com/users/distri/following{/other_user}",
      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
      "organizations_url": "https://api.github.com/users/distri/orgs",
      "repos_url": "https://api.github.com/users/distri/repos",
      "events_url": "https://api.github.com/users/distri/events{/privacy}",
      "received_events_url": "https://api.github.com/users/distri/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/distri/bit_array",
    "description": "A Bit Array for JS",
    "fork": false,
    "url": "https://api.github.com/repos/distri/bit_array",
    "forks_url": "https://api.github.com/repos/distri/bit_array/forks",
    "keys_url": "https://api.github.com/repos/distri/bit_array/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/distri/bit_array/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/distri/bit_array/teams",
    "hooks_url": "https://api.github.com/repos/distri/bit_array/hooks",
    "issue_events_url": "https://api.github.com/repos/distri/bit_array/issues/events{/number}",
    "events_url": "https://api.github.com/repos/distri/bit_array/events",
    "assignees_url": "https://api.github.com/repos/distri/bit_array/assignees{/user}",
    "branches_url": "https://api.github.com/repos/distri/bit_array/branches{/branch}",
    "tags_url": "https://api.github.com/repos/distri/bit_array/tags",
    "blobs_url": "https://api.github.com/repos/distri/bit_array/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/distri/bit_array/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/distri/bit_array/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/distri/bit_array/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/distri/bit_array/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/distri/bit_array/languages",
    "stargazers_url": "https://api.github.com/repos/distri/bit_array/stargazers",
    "contributors_url": "https://api.github.com/repos/distri/bit_array/contributors",
    "subscribers_url": "https://api.github.com/repos/distri/bit_array/subscribers",
    "subscription_url": "https://api.github.com/repos/distri/bit_array/subscription",
    "commits_url": "https://api.github.com/repos/distri/bit_array/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/distri/bit_array/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/distri/bit_array/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/distri/bit_array/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/distri/bit_array/contents/{+path}",
    "compare_url": "https://api.github.com/repos/distri/bit_array/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/distri/bit_array/merges",
    "archive_url": "https://api.github.com/repos/distri/bit_array/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/distri/bit_array/downloads",
    "issues_url": "https://api.github.com/repos/distri/bit_array/issues{/number}",
    "pulls_url": "https://api.github.com/repos/distri/bit_array/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/distri/bit_array/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/distri/bit_array/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/distri/bit_array/labels{/name}",
    "releases_url": "https://api.github.com/repos/distri/bit_array/releases{/id}",
    "created_at": "2013-12-03T18:41:11Z",
    "updated_at": "2013-12-03T18:42:45Z",
    "pushed_at": "2013-12-03T18:42:41Z",
    "git_url": "git://github.com/distri/bit_array.git",
    "ssh_url": "git@github.com:distri/bit_array.git",
    "clone_url": "https://github.com/distri/bit_array.git",
    "svn_url": "https://github.com/distri/bit_array",
    "homepage": null,
    "size": 152,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "CoffeeScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "master_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "organization": {
      "login": "distri",
      "id": 6005125,
      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
      "gravatar_id": null,
      "url": "https://api.github.com/users/distri",
      "html_url": "https://github.com/distri",
      "followers_url": "https://api.github.com/users/distri/followers",
      "following_url": "https://api.github.com/users/distri/following{/other_user}",
      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
      "organizations_url": "https://api.github.com/users/distri/orgs",
      "repos_url": "https://api.github.com/users/distri/repos",
      "events_url": "https://api.github.com/users/distri/events{/privacy}",
      "received_events_url": "https://api.github.com/users/distri/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "network_count": 0,
    "subscribers_count": 2,
    "branch": "master",
    "defaultBranch": "master"
  },
  "dependencies": {}
});