import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { App3D } from "./App3D";
import { GLTFModelLoader } from "./app3d-imp/GLTFModelLoader";
import { RendererAndCameraResizer } from "./app3d-imp/RendererAndCameraResizer";
import { CameraControlImp } from "./app3d-imp/CameraControlImp";

export function createApp3D(canvas: HTMLCanvasElement) {

  const scene = new Scene();
  const renderer = new WebGLRenderer({
    canvas
  });
  const camera = new PerspectiveCamera();
  camera.position.set(0, 0, 20)
  const modelLoader = new GLTFModelLoader();
  const resizer = new RendererAndCameraResizer( renderer, camera );
  const cameraControl = new CameraControlImp();

  return new App3D( scene, camera, renderer, modelLoader, resizer, cameraControl );

}