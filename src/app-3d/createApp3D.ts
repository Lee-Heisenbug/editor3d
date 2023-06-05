import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { App3D } from "./App3D";

export function createApp3D(canvas: HTMLCanvasElement) {

  const scene = new Scene();
  const renderer = new WebGLRenderer({
    canvas
  });
  const camera = new PerspectiveCamera();

  return new App3D( scene, camera, renderer );

}