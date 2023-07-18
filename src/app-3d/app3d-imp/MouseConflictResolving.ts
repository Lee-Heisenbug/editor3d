import type { Initiator } from '../App3D'
import type { CameraControlImp } from './CameraControlImp'
import type { Transforming } from './Transforming'

export class MouseConflictResolving implements Initiator {
  private _transforming: Transforming
  private _cameraControls: CameraControlImp
  constructor(transforming: Transforming, cameraControls: CameraControlImp) {
    this._transforming = transforming
    this._cameraControls = cameraControls
  }
  initiate(): void {
    const transformControl = this._transforming.transformControl

    transformControl.addEventListener('mouseDown', () => {
      this._cameraControls.getControls().enabled = false
    })

    transformControl.addEventListener('mouseUp', () => {
      this._cameraControls.getControls().enabled = true
    })
  }
}
