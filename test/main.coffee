BitArray = require "../main"

testPattern = (n) ->
  bitArray = BitArray(256)

  [0...256].forEach (i) ->
    bitArray.set(i, i % n is 0)

  reloadedArray = BitArray(bitArray.toJSON())

  [0...256].forEach (i) ->
    test = 0 | (i % n is 0)
    assert.equal reloadedArray.get(i), test, "Bit #{i} is #{test}"

describe "BitArray", ->
  it "should be empty to start", ->
    bitArray = BitArray(256)

    [0...256].forEach (i) ->
      assert.equal bitArray.get(i), 0

  it "should be able to set and get bits", ->
    bitArray = BitArray(256)

    [0...256].forEach (i) ->
      bitArray.set(i, 1)

    [0...256].forEach (i) ->
      assert.equal bitArray.get(i), 1

  it "should be serializable and deserializable", ->
    bitArray = BitArray(256)

    [0...256].forEach (i) ->
      bitArray.set(i, 1)

    reloadedArray = BitArray(bitArray.toJSON())

    [0...256].forEach (i) ->
      assert.equal reloadedArray.get(i), 1, "Bit #{i} is 1"

  it "should be serializable and deserializable with various patterns", ->
    testPattern(1)
    testPattern(2)
    testPattern(3)
    testPattern(4)
    testPattern(5)
    testPattern(7)
    testPattern(11)
    testPattern(32)
    testPattern(63)
    testPattern(64)
    testPattern(77)
    testPattern(128)

  # Some may wish for this to throw an error, but normal JS arrays don't
  # and by default neither do typed arrays so this is just 'going with the flow'
  it "should silently discard setting out of range values", ->
    bitArray = BitArray(8)

    assert.equal bitArray.set(9, 1), undefined
    assert.equal bitArray.get(9), undefined

  it "should know its size", ->
    bitArray = BitArray(128)

    assert.equal bitArray.size(), 128

  it "shouldn't be too big when serializing as json", ->
    bitLength = 2048
    bitArray = BitArray(bitLength)

    serializedLength = bitArray.toJSON().length

    n = 4
    assert serializedLength < bitLength / n, "Serialized length < bit length divided by #{n} : #{serializedLength} < #{bitLength / n}"


  it "should be sized exactly"
  -> # PENDING
    bitArray = BitArray(127)

    assert.equal bitArray.size(), 127

  it "should be exactly to the bit in length"
  # Pending, we'd need to store an extra 3-bits (probably as 1 byte) to hold the
  # offset from largest byte and read it out and back when serializing
  ->
    bitArray = BitArray(9)

    assert.equal bitArray.set(10, 1), undefined
    assert.equal bitArray.get(10), undefined
