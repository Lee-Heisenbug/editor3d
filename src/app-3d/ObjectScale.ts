import type { Object3D, Vector3 } from 'three'

export interface Mouse {
  onClick(callback: MouseEventCallback): void
}

export type MouseEventCallback = (mousePosition: MousePosition) => void

export interface MousePosition {
  [0]: number
  [1]: number
}

export interface Scene {
  selectObject(mousePosition: MousePosition): Object3D | null
}

export interface BoundingBox {
  visible: boolean
  update(object: Object3D): void
}

export interface ScaleWidget {
  visible: boolean
  position: Vector3
}

export class ObjectScale {
  private _mouse: Mouse
  private _scene: Scene
  private _scaleWidget: ScaleWidget
  private _boundingBox: BoundingBox
  constructor(mouse: Mouse, scene: Scene, scaleWidget: ScaleWidget, boundingBox: BoundingBox) {
    this._mouse = mouse
    this._scene = scene
    this._scaleWidget = scaleWidget
    this._boundingBox = boundingBox
  }

  initiate() {
    this._mouse.onClick((mousePos) => {
      const selectedObject = this._scene.selectObject(mousePos)
      if (selectedObject) {
        this._boundingBox.visible = true
        this._boundingBox.update(selectedObject)
        this._scaleWidget.visible = true
        this._scaleWidget.position = selectedObject.position
      } else {
        this._boundingBox.visible = false
        this._scaleWidget.visible = false
      }
    })
  }
}
