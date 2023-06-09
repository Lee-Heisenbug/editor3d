import { beforeAll, describe, expect, it, vi } from 'vitest'
import { ObjectScale } from '../ObjectScale'
import type { MouseEventCallback, Mouse, MousePosition, Scene, BoundingBox } from '../ObjectScale'
import { Object3D } from 'three'

class MouseTest implements Mouse {
  callback: MouseEventCallback | null = null
  onClick(callback: MouseEventCallback) {
    this.callback = callback
  }
}

class SceneTest implements Scene {
  mousePos: MousePosition | null = null
  selectedObject: Object3D | null = null
  selectObject(mousePosition: MousePosition) {
    this.mousePos = mousePosition
    return this.selectedObject
  }
}

class BoundingBoxTest implements BoundingBox {
  visible = false
  object: Object3D | null = null
  update(object: Object3D) {
    this.object = object
  }
}

const mouse = new MouseTest()
const scene = new SceneTest()
const boundingBox = new BoundingBoxTest()
const objectScale = new ObjectScale(mouse, scene, boundingBox)
const objectSelectCallback = vi.fn()

describe('ObjectScale', () => {
  objectScale.onObjectSelect(objectSelectCallback)
  objectScale.initiate()
  const pos: MousePosition = [0, 0]

  describe('when a object is selected', () => {
    beforeAll(() => {
      scene.selectedObject = new Object3D()
      mouse.callback!(pos)
    })

    it('select object from scene when mouse click', () => {
      expect(scene.mousePos).toBe(pos)
    })

    it('should show bounding box', () => {
      expect(boundingBox.visible).toBe(true)
      expect(boundingBox.object).toBe(scene.selectedObject)
    })

    it('should invoke callback', () => {
      expect(objectSelectCallback).toHaveBeenCalledWith(scene.selectedObject)
    })
  })

  describe('when no object is selected', () => {
    beforeAll(() => {
      scene.selectedObject = null
      boundingBox.visible = true
      mouse.callback!(pos)
    })

    it('should hide bounding box', () => {
      expect(boundingBox.visible).toBe(false)
    })

    it('should invoke callback', () => {
      expect(objectSelectCallback).toHaveBeenCalledWith(scene.selectedObject)
    })
  })
})
