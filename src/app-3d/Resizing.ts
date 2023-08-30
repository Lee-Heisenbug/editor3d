export interface Resizer {
  setSize(size: Size): void
}

export interface Size {
  width: number
  height: number
}

export class Resizing {
  private _resizer: Resizer

  constructor(resizer: Resizer) {
    this._resizer = resizer
  }

  initiate() {
    this._resize()

    window.addEventListener('resize', () => {
      this._resize()
    })
  }

  private _resize() {
    const hierarchyUIWidth = 300
    this._resizer.setSize({
      width: window.innerWidth - hierarchyUIWidth,
      height: window.innerHeight
    })
  }
}
