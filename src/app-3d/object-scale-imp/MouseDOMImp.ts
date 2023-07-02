import type { Mouse, MouseEventCallback } from '../ObjectScale'

export class MouseDOMImp implements Mouse {
  private _dom: HTMLElement
  constructor(dom: HTMLElement) {
    this._dom = dom
  }
  onClick(callback: MouseEventCallback): void {
    this._dom.addEventListener('click', (e) => {
      callback([e.offsetX, e.offsetY])
    })
  }
}
