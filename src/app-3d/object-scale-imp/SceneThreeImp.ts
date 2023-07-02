import {
  Vector2,
  type Camera,
  type Raycaster,
  type Scene as SceneThree,
  Object3D,
  Box3,
  Box3Helper
} from 'three'
import type { MousePosition, Object, Scene } from '../ObjectScale'

export class SceneThreeImp implements Scene {
  private _scene: SceneThree
  private _camera: Camera
  private _dom: HTMLCanvasElement
  private _raycaster: Raycaster
  private _box: Box3
  private _boxHelper: Box3Helper
  constructor(
    scene: SceneThree,
    camera: Camera,
    dom: HTMLCanvasElement,
    raycaster: Raycaster,
    box: Box3,
    boxHelper: Box3Helper
  ) {
    this._scene = scene
    this._camera = camera
    this._dom = dom
    this._raycaster = raycaster
    this._box = box
    this._boxHelper = boxHelper
    this._scene.add(this._boxHelper)
    this._boxHelper.visible = false
  }
  selectObject(mousePosition: MousePosition): Object {
    const clipPos = new Vector2(
      (mousePosition[0] / this._dom.width - 0.5) / 0.5,
      -(mousePosition[1] / this._dom.height - 0.5) / 0.5
    )

    this._raycaster.setFromCamera(clipPos, this._camera)
    const intersection = this._raycaster.intersectObject(this._scene)

    if (intersection[0]) {
      return new ObjectThreeImp(intersection[0].object, this._box, this._boxHelper)
    }

    return new EmptyObject(this._boxHelper)
  }
}

class EmptyObject implements Object {
  private _boxHelper: Box3Helper
  constructor(boxHelper: Box3Helper) {
    this._boxHelper = boxHelper
  }
  showBoundingBox(): void {
    this._boxHelper.visible = false
  }
}

class ObjectThreeImp implements Object {
  private _object3D: Object3D
  private _box: Box3
  private _boxHelper: Box3Helper
  constructor(object3D: Object3D, box: Box3, boxHelper: Box3Helper) {
    this._object3D = object3D
    this._box = box
    this._boxHelper = boxHelper
  }
  showBoundingBox(): void {
    this._box.makeEmpty()
    this._box.expandByObject(this._object3D)
    this._boxHelper.visible = true
  }
}
