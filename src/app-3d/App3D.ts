import { AmbientLight, Camera, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export interface ModelLoader {
  load(cb: (model: Object3D) => void): void
}

export interface Resizer {
  setSize(size: Size): void
}

export interface CameraControl {
  initiate(camera: Camera, dom: HTMLElement): void
}

export interface Size {
  width: number
  height: number
}

export class App3D {
  private _scene: Scene
  private _camera: PerspectiveCamera
  private _renderer: WebGLRenderer
  private _modelLoader: ModelLoader
  private _resizer: Resizer
  private _cameraControl: CameraControl

  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    modelLoader: ModelLoader,
    resizer: Resizer,
    cameraControl: CameraControl
  ) {
    this._scene = scene
    this._camera = camera
    this._renderer = renderer
    this._modelLoader = modelLoader
    this._resizer = resizer
    this._cameraControl = cameraControl
  }

  initiate() {
    this._renderer.setAnimationLoop(() => {
      this._renderer.render(this._scene, this._camera)
    })

    this._initResizing()

    this._constructScene()

    this._loadModel()

    this._cameraControl.initiate(this._camera, this._renderer.domElement)
  }

  private _initResizing() {
    this._resize()

    window.addEventListener('resize', () => {
      this._resize()
    })
  }

  private _resize() {
    this._resizer.setSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  private _constructScene() {
    this._scene.add(new AmbientLight())
  }

  private _loadModel() {
    this._modelLoader.load((model) => {
      this._scene.add(model)
    })
  }
}
