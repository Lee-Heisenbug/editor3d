import { AmbientLight, Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export interface CameraControl {
  initiate(camera: Camera, dom: HTMLElement): void
}

export interface Size {
  width: number
  height: number
}

export interface Infra {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
}

export interface Initiator {
  initiate(infra: Infra): void
}

export class App3D {
  private _scene: Scene
  private _camera: PerspectiveCamera
  private _renderer: WebGLRenderer
  private _cameraControl: CameraControl
  private _initiator: Initiator

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    cameraControl: CameraControl,
    initiator: Initiator
  ) {
    this._scene = scene
    this._camera = camera
    this._renderer = renderer
    this._cameraControl = cameraControl
    this._initiator = initiator
  }

  initiate() {
    this._renderer.setAnimationLoop(() => {
      this._renderer.render(this._scene, this._camera)
    })

    this._constructScene()

    this._cameraControl.initiate(this._camera, this._renderer.domElement)

    this._initiator.initiate({
      scene: this._scene,
      camera: this._camera,
      renderer: this._renderer
    })
  }

  private _constructScene() {
    this._scene.add(new AmbientLight())
  }
}
