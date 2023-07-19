import type { Infra, Initiator } from '../App3D'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import type { ObjectSelectionInitiator } from './ObjectSelectionInitiator'

export class Transforming implements Initiator {
  private _objectSelectionInitiator: ObjectSelectionInitiator
  transformControl!: TransformControls

  constructor(objectSelection: ObjectSelectionInitiator) {
    this._objectSelectionInitiator = objectSelection
  }

  initiate({ camera, renderer, scene }: Infra): void {
    this.transformControl = new TransformControls(camera, renderer.domElement)

    this.transformControl.visible = false
    this.transformControl.mode = 'translate'
    scene.add(this.transformControl)

    this._attachedToObjectOnObjectSelected()

    this._ignoreTransformGizmoSelection()

    this._updateSelectionBoundingBoxOnChanged()
  }

  private _attachedToObjectOnObjectSelected() {
    this._objectSelectionInitiator.objectSelection.onObjectSelect((object) => {
      if (object) {
        this.transformControl.visible = true
        this.transformControl.attach(object)
      } else {
        this.transformControl.visible = false
      }
    })
  }

  private _ignoreTransformGizmoSelection() {
    this._objectSelectionInitiator.addIgnoreSelectionObject(this.transformControl)
  }

  private _updateSelectionBoundingBoxOnChanged() {
    const selectionBox = this._objectSelectionInitiator.selectionBox.box
    this.transformControl.addEventListener('change', () => {
      const object = this.transformControl.object

      if (object !== undefined) {
        selectionBox.setFromObject(object)
      }
    })
  }
}
