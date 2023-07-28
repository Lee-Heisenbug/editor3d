import { Object3D, PerspectiveCamera, Scene as SceneThree, WebGLRenderer } from 'three'
import { App3D as AppThree, type ModelLoader } from './App3D'
import { GLTFModelLoader } from './app3d-imp/GLTFModelLoader'
import { RendererAndCameraResizer } from './app3d-imp/RendererAndCameraResizer'
import { CameraControlImp } from './app3d-imp/CameraControlImp'
import carModelSrc from './mp44.glb'
import garageModelSrc from './garage.glb'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GridAdder } from './app3d-imp/GridAdder'
import { InitiatorComposite } from './app3d-imp/InitiatorComposite'
import { ObjectSelectionInitiator } from './app3d-imp/ObjectSelectionInitiator'
import { Transforming } from './app3d-imp/Transforming'
import { MouseConflictResolving } from './app3d-imp/MouseConflictResolving'
import { InitFuncInitiator } from './app3d-imp/InitFuncInitiator'

export function createApp3D(canvas: HTMLCanvasElement): UI {
  const scene = new SceneThree()
  const renderer = new WebGLRenderer({
    canvas
  })
  const camera = new PerspectiveCamera()
  camera.position.set(0, 0, 20)
  const modelLoaderMock: ModelLoader = {
    load() {}
  }
  const resizer = new RendererAndCameraResizer(renderer, camera)
  const cameraControl = new CameraControlImp()

  const selection = new ObjectSelectionInitiator()
  const transforming = new Transforming(selection)

  let modelScene: ModelScene

  const ui = new UIComposite()

  const appThree = new AppThree(
    scene,
    camera,
    renderer,
    modelLoaderMock,
    resizer,
    cameraControl,
    new InitiatorComposite([
      new GridAdder(),
      new InitFuncInitiator([
        (infra) => {
          const gltfLoader = new GLTFLoader()
          const modelLoader = new GLTFModelLoader([carModelSrc, garageModelSrc], gltfLoader)

          modelScene = new ModelScene(infra.scene)

          ui.add(new ModelSceneUI(modelScene))

          modelLoader.load((model) => {
            modelScene.add(model)
          })
        }
      ]),
      selection,
      transforming,
      new MouseConflictResolving(transforming, cameraControl)
    ])
  )

  ui.add(new UIImp(appThree))

  return ui
}

type Node = {
  id: string
  name: string
  children: Node[]
}

type HierarchyChangedCallback = (hierarchy: Node[]) => void

interface UI {
  initiate(): void
  onHierachyChanged(cb: HierarchyChangedCallback): void
}

class UIComposite implements UI {
  private _uis: UI[] = []
  add(ui: UI) {
    this._uis.push(ui)
  }
  initiate(): void {
    this._uis.forEach((ui) => {
      ui.initiate()
    })
  }
  onHierachyChanged(cb: HierarchyChangedCallback): void {
    this._uis.forEach((ui) => {
      ui.onHierachyChanged(cb)
    })
  }
}

class UIImp implements UI {
  private _appThree: AppThree
  constructor(appThree: AppThree) {
    this._appThree = appThree
  }
  initiate() {
    this._appThree.initiate()
  }
  onHierachyChanged() {}
}

class ModelSceneUI implements UI {
  private _modelScene: ModelScene
  constructor(modelScene: ModelScene) {
    this._modelScene = modelScene
  }
  initiate() {}
  onHierachyChanged(cb: HierarchyChangedCallback) {
    this._modelScene.onHierachyChanged(cb)
  }
}

class ModelScene {
  private _sceneThree: SceneThree
  private _hierarchyChangedCallback: HierarchyChangedCallback = () => {}
  private _models: Object3D[] = []
  constructor(sceneThree: SceneThree) {
    this._sceneThree = sceneThree
  }

  onHierachyChanged(cb: HierarchyChangedCallback) {
    this._hierarchyChangedCallback = cb
  }

  add(model: Object3D) {
    this._models.push(model)
    this._sceneThree.add(model)
    this._hierarchyChangedCallback(this._getHierarchy())
  }

  _getHierarchy() {
    return this._models.map((model) => {
      return this._getNode(model)
    })
  }

  _getNode(model: Object3D): Node {
    const node: Node = {
      id: model.uuid,
      name: model.name,
      children: model.children.map((child) => {
        return this._getNode(child)
      })
    }

    return node
  }
}
