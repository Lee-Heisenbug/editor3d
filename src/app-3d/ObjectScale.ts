import type { Object3D } from 'three'

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

export type ObjectSelectCallback = (selectedObject: Object3D | null) => void

export class ObjectScale {
  private _mouse: Mouse
  private _scene: Scene
  private _boundingBox: BoundingBox
  private _objectSelectedCallback: ObjectSelectCallback = () => {}
  constructor(mouse: Mouse, scene: Scene, boundingBox: BoundingBox) {
    this._mouse = mouse
    this._scene = scene
    this._boundingBox = boundingBox
  }

  initiate() {
    this._mouse.onClick((mousePos) => {
      const selectedObject = this._scene.selectObject(mousePos)
      if (selectedObject) {
        this._boundingBox.visible = true
        this._boundingBox.update(selectedObject)
      } else {
        this._boundingBox.visible = false
      }

      this._objectSelectedCallback(selectedObject)
    })
  }

  onObjectSelect(cb: ObjectSelectCallback) {
    this._objectSelectedCallback = cb
  }
}
