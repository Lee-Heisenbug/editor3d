import { describe, it, expect, vi, beforeAll } from 'vitest'
import { App3D } from '../App3D'
import type { CameraControl, ModelLoader, Initiator, Infra } from '../App3D'
import { AmbientLight, Camera, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

class ModelLoaderTest implements ModelLoader {
  loadedModel = new Object3D()
  loadedCall = () => {}

  constructor() {}

  load(cb: (model: Object3D) => void) {
    this.loadedCall = () => {
      cb(this.loadedModel)
    }
  }
}

class CameraControlTest implements CameraControl {
  camera: Camera | null = null
  dom: HTMLElement | null = null
  initiate(camera: Camera, dom: HTMLElement) {
    this.camera = camera
    this.dom = dom
  }
}

class InitiatorTest implements Initiator {
  camera: Camera | null = null
  scene: Scene | null = null
  renderer: WebGLRenderer | null = null
  initiate({ scene, camera, renderer }: Infra) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
  }
}

const renderer = new WebGLRenderer()
renderer.domElement = document.createElement('canvas')
const scene = new Scene()
const camera = new PerspectiveCamera()
const modelLoader = new ModelLoaderTest()
const cameraControl = new CameraControlTest()
const initiator = new InitiatorTest()

const app = new App3D(scene, camera, renderer, modelLoader, cameraControl, initiator)

describe('initiating', () => {
  const rendererSpy = vi.spyOn(renderer, 'setAnimationLoop')
  const sceneSpy = vi.spyOn(scene, 'add')

  beforeAll(() => {
    window.innerHeight = 600
    window.innerWidth = 800
    app.initiate()
  })

  it('should render scene with camera on animation loop', () => {
    const loopCallback = <Function>rendererSpy.mock.calls[0][0]

    loopCallback()
    expect(renderer.render).toHaveBeenCalledWith(scene, camera)
  })

  describe('constructing scene', () => {
    it('should has an ambient light', () => {
      expect((<AmbientLight>sceneSpy.mock.calls[0][0]).isAmbientLight).toBe(true)
    })
  })

  describe('loading model', () => {
    beforeAll(() => {
      sceneSpy.mockClear()
      modelLoader.loadedCall()
    })

    it('should add loadded model to scene when model loaded', () => {
      expect(sceneSpy).toHaveBeenCalledWith(modelLoader.loadedModel)
    })
  })

  describe('camera control', () => {
    it('should initiate camera control', () => {
      expect(cameraControl.camera).toBe(camera)
      expect(cameraControl.dom).toBe(renderer.domElement)
    })
  })

  it('should initiate via initiator', () => {
    expect(initiator.scene).toBe(scene)
    expect(initiator.camera).toBe(camera)
    expect(initiator.renderer).toBe(renderer)
  })
})

vi.mock('three', () => {
  const WebGLRenderer = vi.fn()
  WebGLRenderer.prototype.setAnimationLoop = vi.fn()
  WebGLRenderer.prototype.render = vi.fn()
  WebGLRenderer.prototype.setSize = vi.fn()

  const Scene = vi.fn()
  Scene.prototype.add = vi.fn()

  const PerspectiveCamera = vi.fn()

  const AmbientLight = vi.fn()
  AmbientLight.prototype.isAmbientLight = true

  const Object3D = vi.fn()

  return {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    Object3D
  }
})
