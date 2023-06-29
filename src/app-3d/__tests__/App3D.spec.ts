import { describe, it, expect, vi, beforeAll } from 'vitest'
import { App3D } from '../App3D'
import type { CameraControl, ModelLoader, Resizer, Size } from '../App3D'
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

class ResizerTest implements Resizer {
  size: Size | null = null
  setSize(size: Size) {
    this.size = size
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

const renderer = new WebGLRenderer()
renderer.domElement = document.createElement('canvas')
const scene = new Scene()
const camera = new PerspectiveCamera()
const modelLoader = new ModelLoaderTest()
const resizer = new ResizerTest()
const cameraControl = new CameraControlTest()

const app = new App3D(scene, camera, renderer, modelLoader, resizer, cameraControl)

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

  describe('resizing', () => {
    it('should resize on initiation', () => {
      expect(resizer.size).toEqual({
        width: window.innerWidth,
        height: window.innerHeight
      })
    })

    it('should also resize when window resize', () => {
      const newSize = [1920, 1080]

      ;[window.innerWidth, window.innerHeight] = newSize

      window.dispatchEvent(new CustomEvent('resize'))

      expect(resizer.size).toEqual({
        width: window.innerWidth,
        height: window.innerHeight
      })
    })
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
