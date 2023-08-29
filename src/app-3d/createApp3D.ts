import {
  Box3,
  Box3Helper,
  Object3D,
  PerspectiveCamera,
  Scene as SceneThree,
  WebGLRenderer
} from 'three'
import { App3D as App3DConcrete, type ModelLoader } from './App3D'
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
import { ObjectHighlighting } from './ObjectHighlighting'
import { BoundingBoxThree, ObjectSelectorImp } from './app3d-imp/object-highlighting-imp'

export function createApp3D(canvas: HTMLCanvasElement): App3D {
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
  const selector = new ObjectSelectorImp(scene)
  const objectBox = new Box3()
  const transforming = new Transforming(selector, selection, objectBox)

  let modelScene: ModelScene

  const app3D = new App3DComposite()

  const appThree = new App3DConcrete(
    scene,
    camera,
    renderer,
    modelLoaderMock,
    resizer,
    cameraControl,
    new InitiatorComposite([
      new GridAdder(),
      selection,
      new InitFuncInitiator([
        () => {
          selector.setObjectSelection(selection.objectSelection)
          app3D.add(
            new App3DOptionalImp({
              onObjectSelect(cb) {
                selector.onObjectSelect((object) => {
                  if (object) {
                    cb(object.uuid)
                  } else {
                    cb(null)
                  }
                })
              },
              selectObject: function (id: string): void {
                selector.selectFromScene(id)
              }
            })
          )
        },
        (infra) => {
          const gltfLoader = new GLTFLoader()
          const modelLoader = new GLTFModelLoader([carModelSrc, garageModelSrc], gltfLoader)

          modelScene = new ModelScene(infra.scene)

          app3D.add(new ModelSceneUI(modelScene))

          modelLoader.load((model) => {
            modelScene.add(model)
          })
        },
        (infra) => {
          class IntersectionIgnoreWrapper extends Object3D {
            constructor(object: Object3D) {
              super()
              this.add(object)
            }
            add(...object: Object3D[]): this {
              super.add(...object)
              object.forEach((obj) => {
                obj.raycast = () => {}
              })

              return this
            }
          }

          const boxHelper = new Box3Helper(objectBox)
          boxHelper.visible = false

          infra.scene.add(new IntersectionIgnoreWrapper(boxHelper))

          new ObjectHighlighting(selector, new BoundingBoxThree(boxHelper)).initiate()
        }
      ]),
      transforming,
      new MouseConflictResolving(transforming, cameraControl)
    ])
  )

  app3D.add(new App3DImp(appThree))

  return app3D
}

type Node = {
  id: string
  name: string
  children: Node[]
}

type HierarchyChangedCallback = (hierarchy: Node[]) => void

export interface App3D {
  initiate(): void
  onHierachyChanged(cb: HierarchyChangedCallback): void
  onObjectSelect(cb: (id: string | null) => void): void
  selectObject(id: string): void
}

class App3DComposite implements App3D {
  selectObject(id: string): void {
    this._app3Ds.forEach((app3D) => {
      app3D.selectObject(id)
    })
  }
  private _app3Ds: App3D[] = []
  add(app3D: App3D) {
    this._app3Ds.push(app3D)
  }
  initiate(): void {
    this._app3Ds.forEach((app3D) => {
      app3D.initiate()
    })
  }
  onHierachyChanged(cb: HierarchyChangedCallback): void {
    this._app3Ds.forEach((app3D) => {
      app3D.onHierachyChanged(cb)
    })
  }
  onObjectSelect(cb: (id: string | null) => void): void {
    this._app3Ds.forEach((app3D) => {
      app3D.onObjectSelect(cb)
    })
  }
}

type OptionalApp3D = {
  [Property in keyof App3D]?: App3D[Property]
}
class App3DOptionalImp implements App3D {
  private _optionalApp3D: OptionalApp3D
  constructor(optionalApp3D: OptionalApp3D) {
    this._optionalApp3D = optionalApp3D
  }
  selectObject(id: string): void {
    this._optionalApp3D.selectObject?.(id)
  }
  initiate(): void {
    this._optionalApp3D.initiate?.()
  }
  onHierachyChanged(cb: HierarchyChangedCallback): void {
    this._optionalApp3D.onHierachyChanged?.(cb)
  }
  onObjectSelect(cb: (id: string | null) => void): void {
    this._optionalApp3D.onObjectSelect?.(cb)
  }
}

class App3DImp implements App3D {
  private _appThree: App3DConcrete
  constructor(appThree: App3DConcrete) {
    this._appThree = appThree
  }
  selectObject(): void {}
  onObjectSelect(): void {}
  initiate() {
    this._appThree.initiate()
  }
  onHierachyChanged() {}
}

class ModelSceneUI implements App3D {
  private _modelScene: ModelScene
  constructor(modelScene: ModelScene) {
    this._modelScene = modelScene
  }
  selectObject(): void {}
  onObjectSelect(): void {}
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
