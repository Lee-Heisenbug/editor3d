import type { Infra, Initiator } from '../App3D'
import { TransformControls } from 'three/addons/controls/TransformControls.js'

export class Transforming implements Initiator {
  transformControl!: TransformControls
  initiate({ camera, renderer, scene }: Infra): void {
    this.transformControl = new TransformControls(camera, renderer.domElement)

    this.transformControl.visible = false
    this.transformControl.mode = 'translate'
    scene.add(this.transformControl)
  }
}
