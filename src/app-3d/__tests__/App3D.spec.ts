import { describe, it, expect, vi, beforeAll } from 'vitest'
import { App3D } from '../App3D';
import type { ModelLoader, Resizer, Size } from '../App3D'
import { AmbientLight, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

class ModelLoaderTest implements ModelLoader {

  loadedModel = new Object3D();
  loadedCall = () => {}

  constructor() {

  }

  load( cb: ( model: Object3D ) => void ) {

    this.loadedCall = () => { cb( this.loadedModel) };

  }

}

class ResizerTest implements Resizer {
  size: Size | null = null;
  setSize(size: Size) {
    this.size = size;
  }
}


const renderer = new WebGLRenderer();
const scene = new Scene();
const camera = new PerspectiveCamera();
const modelLoader = new ModelLoaderTest();
const resizer = new ResizerTest();

const app = new App3D( scene, camera, renderer, modelLoader, resizer );

describe( 'initiating', () => {

  const rendererSpy = vi.spyOn(renderer, 'setAnimationLoop');
  const sceneSpy = vi.spyOn( scene, 'add' );

  beforeAll(() => {
    window.innerHeight = 600;
    window.innerWidth = 800;
    app.initiate();
  })

  it('should render scene with camera on animation loop', () => {

    const loopCallback = <Function>rendererSpy.mock.calls[0][0];

    loopCallback();
    expect( renderer.render ).toHaveBeenCalledWith(scene, camera)

  })

  describe('resizing', () => {
    it( 'should resize on initiation', () => {

      expect( resizer.size ).toEqual({
        width: window.innerWidth,
        height: window.innerHeight
      })
      
    })
    
    it('should also resize renderer when window resize', () => {
      
      const newSize = [ 1920, 1080 ];

      [ window.innerWidth,  window.innerHeight ] = newSize;
      
      window.dispatchEvent(new CustomEvent('resize'))
      
      expect( resizer.size ).toEqual({
        width: window.innerWidth,
        height: window.innerHeight
      })

    })

  })

  describe('constructing scene', () => {

    it('should has an ambient light', () => {
      expect( ( <AmbientLight>sceneSpy.mock.calls[0][0] ).isAmbientLight ).toBe( true );
    })

  })

  describe('loading model', () => {

    
    beforeAll(() => {
      sceneSpy.mockClear();
      modelLoader.loadedCall();
    })

    it('should add loadded model to scene when model loaded', () => {

      expect( sceneSpy ).toHaveBeenCalledWith( modelLoader.loadedModel )

    })

  })

} )

vi.mock('three', () => {

  const WebGLRenderer = vi.fn();
  WebGLRenderer.prototype.setAnimationLoop = vi.fn();
  WebGLRenderer.prototype.render = vi.fn();
  WebGLRenderer.prototype.setSize = vi.fn();

  const Scene = vi.fn();
  Scene.prototype.add = vi.fn();

  const PerspectiveCamera = vi.fn();

  const AmbientLight = vi.fn();
  AmbientLight.prototype.isAmbientLight = true;

  const Object3D = vi.fn();

  return {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    AmbientLight,
    Object3D
  }

});