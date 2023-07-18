import type { Mouse, MouseEventCallback, MousePosition } from '../ObjectSelection'

export class MouseDOMImp implements Mouse {
  private _dom: HTMLElement
  private _clickCallback: MouseEventCallback = () => {}
  private _screenPosOnMouseDown: MousePosition = [0, 0]
  constructor(dom: HTMLElement) {
    this._dom = dom
    this._initiate()
  }

  _initiate() {
    this._dom.addEventListener('mousedown', (e) => {
      this._screenPosOnMouseDown = [e.offsetX, e.offsetY]
    })
    this._dom.addEventListener('mouseup', (e) => {
      const screenPosOnMouseUp: MousePosition = [e.offsetX, e.offsetY]
      if (screenPosOnMouseUp[0] === this._screenPosOnMouseDown[0]) {
        if (screenPosOnMouseUp[1] === this._screenPosOnMouseDown[1]) {
          this._clickCallback(screenPosOnMouseUp)
        }
      }
    })
  }

  onClick(callback: MouseEventCallback): void {
    this._clickCallback = callback
  }
}
