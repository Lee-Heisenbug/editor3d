import { Box3, Box3Helper, Object3D, Raycaster } from 'three'
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
  private _scene!: SceneThreeImp
  initiate(infra: Infra): void {
    const raycaster = new Raycaster()
    const box = new Box3()
    const boxHelper = new IntersectionIgnoreBox3Helper(box)
    const boundingBox = new BoundingBoxThree(boxHelper)

    boxHelper.visible = false
    infra.scene.add(boxHelper)

    this._scene = new SceneThreeImp(infra.scene, infra.camera, infra.renderer.domElement, raycaster)

    this.objectSelection = new ObjectSelection(
      new MouseDOMImp(infra.renderer.domElement),
      this._scene,
      boundingBox
    )

    this.objectSelection.initiate()
  }

  addIgnoreSelectionObject(object: Object3D) {
    this._scene.ignoreObjects.push(object)
  }
}
