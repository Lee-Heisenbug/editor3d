import type { Object3D } from 'three'

export interface TransformWidget {
  visible: boolean
  attach(object: Object3D): void
}

export interface ObjectSelectEventCenter {
  onObjectSelected(cb: ObjectSelectCallback): void
}

export type ObjectSelectCallback = (selectedObject: Object3D | null) => void

export class ObjectTransform {
  private _objectSelectEventCenter: ObjectSelectEventCenter
  private _transformWidget: TransformWidget
  constructor(objectSelectEventCenter: ObjectSelectEventCenter, transformWidget: TransformWidget) {
    this._objectSelectEventCenter = objectSelectEventCenter
    this._transformWidget = transformWidget
  }

  initiate() {
    this._objectSelectEventCenter.onObjectSelected((object) => {
      if (object) {
        this._transformWidget.visible = true
        this._transformWidget.attach(object)
      } else {
        this._transformWidget.visible = false
      }
    })
  }
}
