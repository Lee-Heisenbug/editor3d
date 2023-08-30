import type { PerspectiveCamera, WebGLRenderer } from 'three'
import type { Resizer, Size } from '../Resizing'

export class RendererAndCameraResizer implements Resizer {
  private _renderer: WebGLRenderer
  private _camera: PerspectiveCamera
  constructor(renderer: WebGLRenderer, camera: PerspectiveCamera) {
    this._renderer = renderer
    this._camera = camera
  }
  setSize(size: Size): void {
    this._renderer.setSize(size.width, size.height)

    this._camera.aspect = size.width / size.height
    this._camera.updateProjectionMatrix()
  }
}
