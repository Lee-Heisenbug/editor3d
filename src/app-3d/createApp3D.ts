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
import { Box3, Box3Helper, Raycaster } from 'three'
import { ObjectSelection } from './ObjectSelection'
import { MouseDOMImp } from './object-scale-imp/MouseDOMImp'
import { BoundingBoxThree, SceneThreeImp } from './object-scale-imp/SceneThreeImp'
import { TransformControls } from 'three/addons/controls/TransformControls.js'

class IntersectionIgnoreBox3Helper extends Box3Helper {
  raycast(): void {
    this._doNothingToIgnoreIntersection()
  }
  _doNothingToIgnoreIntersection() {}
}

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
          const raycaster = new Raycaster()
          const box = new Box3()
          const boxHelper = new IntersectionIgnoreBox3Helper(box)
          const boundingBox = new BoundingBoxThree(boxHelper)

          const transformControl = new TransformControls(camera, renderer.domElement)
          transformControl.visible = false
          transformControl.mode = 'translate'
          scene.add(transformControl)

          transformControl.addEventListener('mouseDown', () => {
            cameraControl.getControls().enabled = false
          })

          transformControl.addEventListener('mouseUp', () => {
            cameraControl.getControls().enabled = true
          })

          boxHelper.visible = false
          infra.scene.add(boxHelper)

          const objectScale = new ObjectSelection(
            new MouseDOMImp(infra.renderer.domElement),
            new SceneThreeImp(infra.scene, infra.camera, infra.renderer.domElement, raycaster),
            boundingBox
          )

          objectScale.initiate()

          objectScale.onObjectSelect((object) => {
            if (object) {
              transformControl.visible = true
              transformControl.attach(object)
            } else {
              transformControl.visible = false
            }
          })
        }
      ])
    ])
  )
}
