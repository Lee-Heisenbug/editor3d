import { beforeAll, describe, expect, it, vi } from 'vitest'
import { ObjectSelection } from '../ObjectSelection'
import type { MouseEventCallback, Mouse, MousePosition, Scene } from '../ObjectSelection'
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

const mouse = new MouseTest()
const scene = new SceneTest()
const objectSelection = new ObjectSelection(mouse, scene)
const objectSelectCallback = vi.fn()

describe('ObjectSelection', () => {
  objectSelection.onObjectSelect(objectSelectCallback)
  objectSelection.initiate()
  const pos: MousePosition = [0, 0]

  describe('when a object is selected', () => {
    beforeAll(() => {
      scene.selectedObject = new Object3D()
      mouse.callback!(pos)
    })

    it('select object from scene when mouse click', () => {
      expect(scene.mousePos).toBe(pos)
    })

    it('should invoke callback', () => {
      expect(objectSelectCallback).toHaveBeenCalledWith(scene.selectedObject)
    })
  })

  describe('when no object is selected', () => {
    beforeAll(() => {
      scene.selectedObject = null
      mouse.callback!(pos)
    })

    it('should invoke callback', () => {
      expect(objectSelectCallback).toHaveBeenCalledWith(scene.selectedObject)
    })
  })
})
