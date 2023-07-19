import {
  Vector2,
  type Camera,
  type Raycaster,
  type Scene as SceneThree,
  Object3D,
  Box3Helper,
  type Event
} from 'three'
import type { MousePosition, BoundingBox, Scene } from '../ObjectSelection'

export class SceneThreeImp implements Scene {
  private _scene: SceneThree
  private _camera: Camera
  private _dom: HTMLCanvasElement
  private _raycaster: Raycaster
  ignoreObjects: Object3D[]
  constructor(scene: SceneThree, camera: Camera, dom: HTMLCanvasElement, raycaster: Raycaster) {
    this._scene = scene
    this._camera = camera
    this._dom = dom
    this._raycaster = raycaster
    this.ignoreObjects = []
  }
  selectObject(mousePosition: MousePosition) {
    const clipPos = new Vector2(
      (mousePosition[0] / this._dom.width - 0.5) / 0.5,
      -(mousePosition[1] / this._dom.height - 0.5) / 0.5
    )

    this._raycaster.setFromCamera(clipPos, this._camera)
    let intersection = this._raycaster.intersectObject(this._scene)
    intersection = intersection.filter((intersection) => {
      let root = intersection.object

      while (root.parent && root.parent !== this._scene) {
        root = root.parent
      }

      return this.ignoreObjects.indexOf(root) === -1
    })

    if (intersection[0]) {
      return intersection[0].object
    } else {
      return null
    }
  }
}

export class BoundingBoxThree implements BoundingBox {
  private _boxHelper: Box3Helper
  constructor(boxHelper: Box3Helper) {
    this._boxHelper = boxHelper
  }
  set visible(val: boolean) {
    this._boxHelper.visible = val
  }
  update(object: Object3D<Event>): void {
    this._boxHelper.box.makeEmpty()
    this._boxHelper.box.expandByObject(object)
  }
}
