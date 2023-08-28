import type { Object3D } from 'three'

export interface BoundingBox {
  visible: boolean
  update(object: Object3D): void
}

export interface ObjectSelector {
  onObjectSelect(cb: ObjectSelectCallback): void
}

export type ObjectSelectCallback = (selectedObject: Object3D | null) => void

export class ObjectHighlighting {
  private _boundingBox: BoundingBox
  private _objectSelector: ObjectSelector
  constructor(objectSelector: ObjectSelector, boundingBox: BoundingBox) {
    this._objectSelector = objectSelector
    this._boundingBox = boundingBox
  }

  initiate() {
    this._objectSelector.onObjectSelect((selectedObject) => {
      if (selectedObject) {
        this._boundingBox.visible = true
        this._boundingBox.update(selectedObject)
      } else {
        this._boundingBox.visible = false
      }
    })
  }
}
