import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { App3D } from './App3D'
import { GLTFModelLoader } from './app3d-imp/GLTFModelLoader'
import { RendererAndCameraResizer } from './app3d-imp/RendererAndCameraResizer'
import { CameraControlImp } from './app3d-imp/CameraControlImp'
import carModelSrc from './mp44.glb'
import garageModelSrc from './garage.glb'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GridAdder } from './app3d-imp/GridAdder'
import { InitiatorComposite } from './app3d-imp/InitiatorComposite'
import { InitFuncInitiator } from './app3d-imp/InitFuncInitiator'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { ObjectSelectionInitiator } from './app3d-imp/ObjectSelectionInitiator'

export function createApp3D(canvas: HTMLCanvasElement) {
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
  const gridAdder = new GridAdder()
  const transformControl = new TransformControls(camera, canvas)

  return new App3D(
    scene,
    camera,
    renderer,
    modelLoader,
    resizer,
    cameraControl,
    new InitiatorComposite([
      gridAdder,
      new InitFuncInitiator([
        (infra) => {
          const initiator = new ObjectSelectionInitiator()
          initiator.initiate(infra)

          initiator.objectSelection.onObjectSelect((object) => {
            if (object) {
              transformControl.visible = true
              transformControl.attach(object)
            } else {
              transformControl.visible = false
            }
          })
        },
        () => {
          transformControl.visible = false
          transformControl.mode = 'translate'
          scene.add(transformControl)
        },
        () => {
          transformControl.addEventListener('mouseDown', () => {
            cameraControl.getControls().enabled = false
          })

          transformControl.addEventListener('mouseUp', () => {
            cameraControl.getControls().enabled = true
          })
        }
      ])
    ])
  )
}
