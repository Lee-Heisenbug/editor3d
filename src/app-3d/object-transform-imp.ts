import { TransformControls } from 'three/addons/controls/TransformControls.js'
import type { TransformWidget } from './ObjectTransform'
import type { Object3D } from 'three'
export class TransformWidgetImp implements TransformWidget {
  private _transformControls: TransformControls
  constructor(transformControls: TransformControls) {
    this._transformControls = transformControls
  }

  attach(object: Object3D<Event>): void {
    this._transformControls.attach(object)
  }

  set visible(val: boolean) {
    this._transformControls.visible = val
  }
}
