import { Object3D, Box3Helper, type Event, Scene } from 'three'
import type { BoundingBox, ObjectSelectCallback, ObjectSelector } from '../ObjectHighlighting'
import type { ObjectSelection } from '../ObjectSelection'

export class ObjectSelectorImp implements ObjectSelector {
  private _selectCallbacks: ObjectSelectCallback[] = []
  private _scene: Scene

  constructor(scene: Scene) {
    this._scene = scene
  }

  onObjectSelect(cb: (object: Object3D<Event> | null) => void): void {
    this._selectCallbacks.push(cb)
  }

  setObjectSelection(objectSelection: ObjectSelection) {
    objectSelection.onObjectSelect((obj) => {
      this._selectCallbacks.forEach((cb) => {
        cb(obj)
      })
    })
  }

  selectFromScene(id: string) {
    const obj = this._scene.getObjectByProperty('uuid', id)

    this._selectCallbacks.forEach((cb) => {
      cb(obj ? obj : null)
    })
  }
}

export class BoundingBoxThree implements BoundingBox {
  private _boxHelper: Box3Helper
  constructor(boxHelper: Box3Helper) {
    this._boxHelper = boxHelper
  }
  set visible(val: boolean) {
    this._boxHelper.visible = val
  }
  update(object: Object3D<Event>): void {
    this._boxHelper.box.makeEmpty()
    this._boxHelper.box.expandByObject(object)
  }
}
