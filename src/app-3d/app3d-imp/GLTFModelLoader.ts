import type { Object3D, Event } from "three";
import type { ModelLoader } from "../App3D";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import modelSrc from './mp44.glb';

export class GLTFModelLoader implements ModelLoader {
  load(cb: (model: Object3D<Event>) => void): void {

    const loader = new GLTFLoader();
    loader.load( modelSrc, ( gltf ) => {
      cb( gltf.scene );
    })
  }

}