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
}

export class ObjectScale {
  private _mouse: Mouse
  private _scene: Scene
  constructor(mouse: Mouse, scene: Scene) {
    this._mouse = mouse
    this._scene = scene
  }

  initiate() {
    this._mouse.onClick((mousePos) => {
      const selectedObject = this._scene.selectObject(mousePos)
      selectedObject.showBoundingBox()
    })
  }
}
