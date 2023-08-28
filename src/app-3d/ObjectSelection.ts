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

export type ObjectSelectCallback = (selectedObject: Object3D | null) => void

export class ObjectSelection {
  private _mouse: Mouse
  private _scene: Scene
  private _objectSelectedCallback: ObjectSelectCallback = () => {}
  constructor(mouse: Mouse, scene: Scene) {
    this._mouse = mouse
    this._scene = scene
  }

  initiate() {
    this._mouse.onClick((mousePos) => {
      const selectedObject = this._scene.selectObject(mousePos)
      this._objectSelectedCallback(selectedObject)
    })
  }

  onObjectSelect(cb: ObjectSelectCallback) {
    this._objectSelectedCallback = cb
  }
}
