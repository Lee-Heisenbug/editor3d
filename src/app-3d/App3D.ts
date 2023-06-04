import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export class App3D {

  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;

  constructor( scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer ) {

    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;

  }

  initiate() {

    this._renderer.setAnimationLoop(() => {
      this._renderer.render( this._scene, this._camera);
    })

  }

}