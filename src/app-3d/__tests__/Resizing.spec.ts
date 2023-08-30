import { describe, it, expect, beforeAll } from 'vitest'
import { Resizing } from '../Resizing'
import type { Resizer, Size } from '../Resizing'

class ResizerTest implements Resizer {
  size: Size | null = null
  setSize(size: Size) {
    this.size = size
  }
}

const resizer = new ResizerTest()

const resizing = new Resizing(resizer)

describe('initiating', () => {
  beforeAll(() => {
    window.innerHeight = 600
    window.innerWidth = 800
    resizing.initiate()
  })

  describe('resizing', () => {
    const hierarchyUIWidth = 300

    it('should resize on initiation', () => {
      expect(resizer.size).toEqual({
        width: window.innerWidth - hierarchyUIWidth,
        height: window.innerHeight
      })
    })

    it('should also resize when window resize', () => {
      const newSize = [1920, 1080]
      ;[window.innerWidth, window.innerHeight] = newSize

      window.dispatchEvent(new CustomEvent('resize'))

      expect(resizer.size).toEqual({
        width: window.innerWidth - hierarchyUIWidth,
        height: window.innerHeight
      })
    })
  })
})
