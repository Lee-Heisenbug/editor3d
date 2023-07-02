import { describe, expect, it } from 'vitest'
import { ObjectScale } from '../ObjectScale'
import type { MouseEventCallback, Mouse, MousePosition, Scene, Object } from '../ObjectScale'

class ObjectTest implements Object {
  bbShown = false
  showBoundingBox() {
    this.bbShown = true
  }
}

class MouseTest implements Mouse {
  callback: MouseEventCallback | null = null
  onClick(callback: MouseEventCallback) {
    this.callback = callback
  }
}

class SceneTest implements Scene {
  mousePos: MousePosition | null = null
  selectedObject = new ObjectTest()
  selectObject(mousePosition: MousePosition) {
    this.mousePos = mousePosition
    return this.selectedObject
  }
}
const mouse = new MouseTest()
const scene = new SceneTest()
const objectScale = new ObjectScale(mouse, scene)

describe('ObjectScale', () => {
  objectScale.initiate()

  it('select object from scene when mouse click', () => {
    const pos: MousePosition = [0, 0]
    mouse.callback!(pos)
    expect(scene.mousePos).toBe(pos)
    expect(scene.selectedObject.bbShown).toBe(true)
  })
})
