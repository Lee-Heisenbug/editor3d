import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { App3D } from "./App3D";
import { ModelLoaderImp } from "./ModelLoaderImp";

export function createApp3D(canvas: HTMLCanvasElement) {

  const scene = new Scene();
  const renderer = new WebGLRenderer({
    canvas
  });
  const camera = new PerspectiveCamera();
  camera.position.set(0, 0, 20)
  const modelLoader = new ModelLoaderImp();

  return new App3D( scene, camera, renderer, modelLoader );

}