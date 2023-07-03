import { Box3, Box3Helper, Raycaster } from 'three'
import type { Infra, Initiator } from '../App3D'
import { ObjectScale } from '../ObjectScale'
import { MouseDOMImp } from '../object-scale-imp/MouseDOMImp'
import { SceneThreeImp } from '../object-scale-imp/SceneThreeImp'

class IntersectionIgnoreBox3Helper extends Box3Helper {
  raycast(): void {
    this._doNothingToIgnoreIntersection()
  }
  _doNothingToIgnoreIntersection() {}
}

export class ObjectScaleInitiator implements Initiator {
  initiate(infra: Infra): void {
    const raycaster = new Raycaster()
    const box = new Box3()
    const boxHelper = new IntersectionIgnoreBox3Helper(box)
    const objectScale = new ObjectScale(
      new MouseDOMImp(infra.renderer.domElement),
      new SceneThreeImp(
        infra.scene,
        infra.camera,
        infra.renderer.domElement,
        raycaster,
        box,
        boxHelper
      )
    )

    objectScale.initiate()
  }
}
