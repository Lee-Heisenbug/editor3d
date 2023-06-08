import { describe, it, expect, vi, beforeAll } from 'vitest'
import { App3D } from '../App3D';
import { AmbientLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();
const scene = new Scene();
const camera = new PerspectiveCamera();

const app = new App3D( scene, camera, renderer );

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
    it( 'should resize renderer', () => {

      expect( renderer.setSize ).toHaveBeenCalledWith( window.innerWidth, window.innerHeight )
      
    })
    
    it('should also resize renderer when window resize', () => {
      
      const newSize = [ 1920, 1080 ];

      [ window.innerWidth,  window.innerHeight ] = newSize;
      
      window.dispatchEvent(new CustomEvent('resize'))
      
      expect( renderer.setSize ).toHaveBeenLastCalledWith( ...newSize )
      
    })
  })

  describe('constructing scene', () => {

    it('should has an ambient light', () => {
      expect( ( <AmbientLight>sceneSpy.mock.calls[0][0] ).isAmbientLight ).toBe( true );
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

  return {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    AmbientLight
  }

});