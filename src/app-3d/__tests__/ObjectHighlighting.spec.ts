import { beforeAll, describe, expect, it } from 'vitest'
import { ObjectHighlighting } from '../ObjectHighlighting'
import type { ObjectSelector, BoundingBox } from '../ObjectHighlighting'
import { Object3D } from 'three'

class ObjectSelectorTest implements ObjectSelector {
  objectSelectCallback: (object: Object3D | null) => void = () => {}
  onObjectSelect(cb: (object: Object3D | null) => void) {
    this.objectSelectCallback = cb
  }
}

class BoundingBoxTest implements BoundingBox {
  visible = false
  object: Object3D | null = null
  update(object: Object3D) {
    this.object = object
  }
}

const boundingBox = new BoundingBoxTest()
const objectSelector = new ObjectSelectorTest()
const objectHighlighting = new ObjectHighlighting(objectSelector, boundingBox)

describe('ObjectHighlighting', () => {
  objectHighlighting.initiate()
  const object = new Object3D()

  describe('when a object is selected', () => {
    beforeAll(() => {
      objectSelector.objectSelectCallback(object)
    })

    it('should show bounding box', () => {
      expect(boundingBox.visible).toBe(true)
      expect(boundingBox.object).toBe(object)
    })
  })

  describe('when no object is selected', () => {
    beforeAll(() => {
      boundingBox.visible = true
      objectSelector.objectSelectCallback(null)
    })

    it('should hide bounding box', () => {
      expect(boundingBox.visible).toBe(false)
    })
  })
})
