import { beforeAll, describe, expect, it } from 'vitest'
import { ObjectTransform } from '../ObjectTransform'
import type {
  ObjectSelectCallback,
  ObjectSelectEventCenter,
  TransformWidget
} from '../ObjectTransform'
import { Object3D } from 'three'

class TransformWidgetTest implements TransformWidget {
  visible = false
  object: Object3D | null = null
  attach(object: Object3D) {
    this.object = object
  }
}

class ObjectSelectEventCenterTest implements ObjectSelectEventCenter {
  selectedCallback: ObjectSelectCallback = () => {}
  onObjectSelected(cb: ObjectSelectCallback) {
    this.selectedCallback = cb
  }
}
const transformWidget = new TransformWidgetTest()
const objectSelectEventCenter = new ObjectSelectEventCenterTest()
const objectTransform = new ObjectTransform(objectSelectEventCenter, transformWidget)

describe('ObjectTransform', () => {
  objectTransform.initiate()
  const selectedObject = new Object3D()

  describe('when a object is selected', () => {
    beforeAll(() => {
      objectSelectEventCenter.selectedCallback(selectedObject)
    })

    it('should show transform widget', () => {
      expect(transformWidget.visible).toBe(true)
    })

    it('should attach transform widget to object', () => {
      expect(transformWidget.object).toBe(selectedObject)
    })
  })

  describe('when no object is selected', () => {
    beforeAll(() => {
      transformWidget.visible = true
      objectSelectEventCenter.selectedCallback(null)
    })

    it('should hide transform widget', () => {
      expect(transformWidget.visible).toBe(false)
    })
  })
})
