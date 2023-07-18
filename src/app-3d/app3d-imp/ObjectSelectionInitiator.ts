import { Box3, Box3Helper, Raycaster } from 'three'
import type { Infra, Initiator } from '../App3D'
import { ObjectSelection } from '../ObjectSelection'
import { MouseDOMImp } from '../object-scale-imp/MouseDOMImp'
import { BoundingBoxThree, SceneThreeImp } from '../object-scale-imp/SceneThreeImp'

class IntersectionIgnoreBox3Helper extends Box3Helper {
  raycast(): void {
    this._doNothingToIgnoreIntersection()
  }
  _doNothingToIgnoreIntersection() {}
}

export class ObjectSelectionInitiator implements Initiator {
  objectSelection!: ObjectSelection
  initiate(infra: Infra): void {
    const raycaster = new Raycaster()
    const box = new Box3()
    const boxHelper = new IntersectionIgnoreBox3Helper(box)
    const boundingBox = new BoundingBoxThree(boxHelper)

    boxHelper.visible = false
    infra.scene.add(boxHelper)

    this.objectSelection = new ObjectSelection(
      new MouseDOMImp(infra.renderer.domElement),
      new SceneThreeImp(infra.scene, infra.camera, infra.renderer.domElement, raycaster),
      boundingBox
    )

    this.objectSelection.initiate()
  }
}