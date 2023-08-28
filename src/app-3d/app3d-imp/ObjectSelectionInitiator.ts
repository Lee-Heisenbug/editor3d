import { Object3D, Raycaster } from 'three'
import type { Infra, Initiator } from '../App3D'
import { ObjectSelection } from '../ObjectSelection'
import { MouseDOMImp } from '../object-scale-imp/MouseDOMImp'
import { SceneThreeImp } from '../object-scale-imp/SceneThreeImp'

export class ObjectSelectionInitiator implements Initiator {
  objectSelection!: ObjectSelection
  private _scene!: SceneThreeImp

  initiate(infra: Infra): void {
    const raycaster = new Raycaster()

    this._scene = new SceneThreeImp(infra.scene, infra.camera, infra.renderer.domElement, raycaster)

    this.objectSelection = new ObjectSelection(
      new MouseDOMImp(infra.renderer.domElement),
      this._scene
    )

    this.objectSelection.initiate()
  }

  addIgnoreSelectionObject(object: Object3D) {
    this._scene.ignoreObjects.push(object)
  }
}
