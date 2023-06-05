import { describe, it, expect, vi, beforeAll } from 'vitest'
import { App3D } from '../App3D';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();
const scene = new Scene();
const camera = new PerspectiveCamera();

const app = new App3D( scene, camera, renderer );

describe( 'initiating', () => {

  const rendererSpy = vi.spyOn(renderer, 'setAnimationLoop');

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

  it( 'should resize renderer when enable', () => {

    expect( renderer.setSize ).toHaveBeenCalledWith( window.innerWidth, window.innerHeight )
  
  })

} )

vi.mock('three', () => {

  const WebGLRenderer = vi.fn();
  WebGLRenderer.prototype.setAnimationLoop = vi.fn();
  WebGLRenderer.prototype.render = vi.fn();
  WebGLRenderer.prototype.setSize = vi.fn();

  const Scene = vi.fn();

  const PerspectiveCamera = vi.fn();

  return {
    WebGLRenderer,
    Scene,
    PerspectiveCamera
  }

});