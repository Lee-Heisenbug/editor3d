import {
  Vector2,
  type Camera,
  type Raycaster,
  type Scene as SceneThree,
  Object3D,
  Box3Helper,
  type Event,
  Vector3
} from 'three'
import type { MousePosition, BoundingBox, Scene, ScaleWidget } from '../ObjectScale'
import { TransformControls } from 'three/addons/controls/TransformControls.js'

export class SceneThreeImp implements Scene {
  private _scene: SceneThree
  private _camera: Camera
  private _dom: HTMLCanvasElement
  private _raycaster: Raycaster
  constructor(scene: SceneThree, camera: Camera, dom: HTMLCanvasElement, raycaster: Raycaster) {
    this._scene = scene
    this._camera = camera
    this._dom = dom
    this._raycaster = raycaster
  }
  selectObject(mousePosition: MousePosition) {
    const clipPos = new Vector2(
      (mousePosition[0] / this._dom.width - 0.5) / 0.5,
      -(mousePosition[1] / this._dom.height - 0.5) / 0.5
    )

    this._raycaster.setFromCamera(clipPos, this._camera)
    const intersection = this._raycaster.intersectObject(this._scene)

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

export class ScaleWidgetImp implements ScaleWidget {
  private _transformControls: TransformControls
  constructor(transformControls: TransformControls) {
    this._transformControls = transformControls
  }

  set visible(val: boolean) {
    this._transformControls.visible = val
  }

  set position(val: Vector3) {
    this._transformControls.position.copy(val)
  }
}
