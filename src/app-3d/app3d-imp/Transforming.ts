import type { Infra, Initiator } from '../App3D'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import type { ObjectSelector } from '../ObjectHighlighting'
import type { ObjectSelectionInitiator } from './ObjectSelectionInitiator'
import type { Box3 } from 'three'

export class Transforming implements Initiator {
  private _objectSelector: ObjectSelector
  private _objectSelectionInitiator: ObjectSelectionInitiator
  private _objectBox: Box3
  transformControl!: TransformControls

  constructor(
    objectSelector: ObjectSelector,
    objectSelectionInitiator: ObjectSelectionInitiator,
    objectBox: Box3
  ) {
    this._objectSelector = objectSelector
    this._objectSelectionInitiator = objectSelectionInitiator
    this._objectBox = objectBox
  }

  initiate({ camera, renderer, scene }: Infra): void {
    this.transformControl = new TransformControls(camera, renderer.domElement)

    this.transformControl.visible = false
    this.transformControl.mode = 'translate'
    scene.add(this.transformControl)

    this._attachedToObjectOnObjectSelected()

    this._ignoreTransformGizmoSelection()

    this._updateSelectionBoxOnObjectTransformed()

    this._changeTransformModeWhenPressKey()
  }

  private _attachedToObjectOnObjectSelected() {
    this._objectSelector.onObjectSelect((object) => {
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

  private _updateSelectionBoxOnObjectTransformed() {
    const selectionBox = this._objectBox
    this.transformControl.addEventListener('change', () => {
      const object = this.transformControl.object

      if (object !== undefined) {
        selectionBox.setFromObject(object)
      }
    })
  }

  private _changeTransformModeWhenPressKey() {
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyT': {
          this.transformControl.mode = 'translate'
          break
        }

        case 'KeyR': {
          this.transformControl.mode = 'rotate'
          break
        }

        case 'KeyS': {
          this.transformControl.mode = 'scale'
          break
        }
      }
    })
  }
}
