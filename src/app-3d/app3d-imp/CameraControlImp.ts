import type { Camera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { CameraControl } from '../App3D'

export class CameraControlImp implements CameraControl {
  initiate(camera: Camera, dom: HTMLElement): void {
    new OrbitControls(camera, dom).enabled = true
  }
}
