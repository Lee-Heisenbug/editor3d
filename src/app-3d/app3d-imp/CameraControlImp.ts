import type { Camera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { CameraControl } from '../App3D'

export class CameraControlImp implements CameraControl {
  private _controls: OrbitControls | null = null
  initiate(camera: Camera, dom: HTMLElement): void {
    this._controls = new OrbitControls(camera, dom)
  }
  getControls(): OrbitControls {
    return this._controls!
  }
}
