const assert = require('node:assert/strict')
const { describe, it } = require('node:test')

const frontmatter = require('/home/khuchinque/.opencode/gsd-core/bin/lib/frontmatter.cjs')
const { extractFrontmatter, reconstructFrontmatter, stripFrontmatter, parseMustHavesBlock } = frontmatter

describe('extractFrontmatter', () => {
  it('returns empty object for content with no frontmatter', () => {
    assert.deepEqual(extractFrontmatter('just text'), {})
  })
  it('parses simple key: value pairs', () => {
    const result = extractFrontmatter('---\nname: test\ndesc: hello\n---')
    assert.equal(result.name, 'test')
    assert.equal(result.desc, 'hello')
  })
  it('parses nested objects', () => {
    const result = extractFrontmatter('---\nouter:\n  inner: val\n---')
    assert.equal(result.outer.inner, 'val')
  })
  it('parses inline arrays', () => {
    const result = extractFrontmatter('---\nitems: [a, b, c]\n---')
    assert.deepEqual(result.items, ['a', 'b', 'c'])
  })
  it('handles closing --- at end of file', () => {
    const result = extractFrontmatter('---\nkey: value\n---')
    assert.equal(result.key, 'value')
  })
  it('does not parse body content as frontmatter', () => {
    const result = extractFrontmatter('---\nkey: val\n---\n---\nnot: frontmatter')
    assert.equal(result.key, 'val')
    assert.equal(result.not, undefined)
  })
  it('parses CRLF line endings', () => {
    const result = extractFrontmatter('---\r\nkey: val\r\n---\r\nbody')
    assert.equal(result.key, 'val')
  })
  it('handles empty frontmatter block', () => {
    const result = extractFrontmatter('---\n---\nbody')
    assert.deepEqual(result, {})
  })
})

describe('reconstructFrontmatter', () => {
  it('writes simple object', () => {
    const result = reconstructFrontmatter({ name: 'test' })
    assert.match(result, /name: test/)
  })
  it('handles nested object', () => {
    const result = reconstructFrontmatter({ outer: { inner: 'val' } })
    assert.match(result, /inner: val/)
  })
  it('handles empty object', () => {
    assert.equal(reconstructFrontmatter({}), '')
  })
})

describe('stripFrontmatter', () => {
  it('strips frontmatter from content', () => {
    assert.equal(stripFrontmatter('---\nkey: val\n---\nbody text').trim(), 'body text')
  })
  it('returns original if no frontmatter', () => {
    assert.equal(stripFrontmatter('just body'), 'just body')
  })
})

describe('parseMustHavesBlock', () => {
  it('parses truths block', () => {
    const result = parseMustHavesBlock('truths:\n  - "first truth"\n  - "second truth"')
    assert.ok(result)
  })
  it('returns empty array for empty input', () => {
    assert.deepEqual(parseMustHavesBlock(''), [])
  })
})
