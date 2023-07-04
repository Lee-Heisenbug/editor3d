import type { Vector3 } from 'three'

export interface Mouse {
  onClick(callback: MouseEventCallback): void
}

export type MouseEventCallback = (mousePosition: MousePosition) => void

export interface MousePosition {
  [0]: number
  [1]: number
}

export interface Scene {
  selectObject(mousePosition: MousePosition): Object
}

export interface Object {
  showBoundingBox(): void
  position: Vector3
}

export interface ScaleWidget {
  position: Vector3
}

export class ObjectScale {
  private _mouse: Mouse
  private _scene: Scene
  private _scaleWidget: ScaleWidget
  constructor(mouse: Mouse, scene: Scene, scaleWidget: ScaleWidget) {
    this._mouse = mouse
    this._scene = scene
    this._scaleWidget = scaleWidget
  }

  initiate() {
    this._mouse.onClick((mousePos) => {
      const selectedObject = this._scene.selectObject(mousePos)
      selectedObject.showBoundingBox()
      this._scaleWidget.position = selectedObject.position
    })
  }
}
