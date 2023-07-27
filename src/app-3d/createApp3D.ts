import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { App3D as AppThree } from './App3D'
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

export function createApp3D(canvas: HTMLCanvasElement): App3D {
  const scene = new Scene()
  const renderer = new WebGLRenderer({
    canvas
  })
  const camera = new PerspectiveCamera()
  camera.position.set(0, 0, 20)
  const gltfLoader = new GLTFLoader()
  const modelLoader = new GLTFModelLoader([carModelSrc, garageModelSrc], gltfLoader)
  const resizer = new RendererAndCameraResizer(renderer, camera)
  const cameraControl = new CameraControlImp()

  const selection = new ObjectSelectionInitiator()
  const transforming = new Transforming(selection)

  const appThree = new AppThree(
    scene,
    camera,
    renderer,
    modelLoader,
    resizer,
    cameraControl,
    new InitiatorComposite([
      new GridAdder(),
      selection,
      transforming,
      new MouseConflictResolving(transforming, cameraControl)
    ])
  )

  return {
    initiate() {
      appThree.initiate()
    },
    onHierachyChanged() {}
  }
}

type Node = {
  id: string
  name: string
  children: Node[]
}

type HierarchyChangedCallback = Node[]

interface App3D {
  initiate(): void
  onHierachyChanged(cb: HierarchyChangedCallback): void
}
