import { Box3, Box3Helper, Object3D, Raycaster, type Event } from 'three'
import type { Infra, Initiator } from '../App3D'
import { ObjectSelection } from '../ObjectSelection'
import { MouseDOMImp } from '../object-scale-imp/MouseDOMImp'
import { BoundingBoxThree, SceneThreeImp } from '../object-scale-imp/SceneThreeImp'

class IntersectionIgnoreWrapper extends Object3D {
  constructor(object: Object3D) {
    super()
    this.add(object)
  }
  add(...object: Object3D<Event>[]): this {
    super.add(...object)
    object.forEach((obj) => {
      obj.raycast = () => {}
    })

    return this
  }
}

export class ObjectSelectionInitiator implements Initiator {
  objectSelection!: ObjectSelection
  selectionBox!: Box3Helper
  private _scene!: SceneThreeImp
  initiate(infra: Infra): void {
    const raycaster = new Raycaster()
    const box = new Box3()
    const boxHelper = new Box3Helper(box)
    const boundingBox = new BoundingBoxThree(boxHelper)

    boxHelper.visible = false
    infra.scene.add(new IntersectionIgnoreWrapper(boxHelper))

    this._scene = new SceneThreeImp(infra.scene, infra.camera, infra.renderer.domElement, raycaster)

    this.objectSelection = new ObjectSelection(
      new MouseDOMImp(infra.renderer.domElement),
      this._scene,
      boundingBox
    )

    this.objectSelection.initiate()

    this.selectionBox = boxHelper
  }

  addIgnoreSelectionObject(object: Object3D) {
    this._scene.ignoreObjects.push(object)
  }
}
