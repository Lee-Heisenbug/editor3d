import { beforeAll, describe, expect, it } from 'vitest'
import { ObjectScale } from '../ObjectScale'
import type {
  MouseEventCallback,
  Mouse,
  MousePosition,
  Scene,
  Object,
  ScaleWidget
} from '../ObjectScale'
import { Vector3 } from 'three'

class ObjectTest implements Object {
  bbShown = false
  position = new Vector3(1, 1, 1)
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

class ScaleWidgetTest implements ScaleWidget {
  position = new Vector3()
}

const mouse = new MouseTest()
const scene = new SceneTest()
const scaleWidget = new ScaleWidgetTest()
const objectScale = new ObjectScale(mouse, scene, scaleWidget)

describe('ObjectScale', () => {
  objectScale.initiate()
  const pos: MousePosition = [0, 0]

  beforeAll(() => {
    mouse.callback!(pos)
  })

  describe('when a object is selected', () => {
    it('select object from scene when mouse click', () => {
      expect(scene.mousePos).toBe(pos)
      expect(scene.selectedObject.bbShown).toBe(true)
    })

    it("should set scale widget' position to object's position", () => {
      expect(scaleWidget.position).toBe(scene.selectedObject.position)
    })
  })
})
