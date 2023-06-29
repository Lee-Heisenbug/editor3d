import { Object3D, type Event } from 'three'
import type { ModelLoader } from '../App3D'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class GLTFModelLoader implements ModelLoader {
  private _urls: string[]
  private _loader: GLTFLoader
  constructor(urls: string[] = [], loader: GLTFLoader) {
    this._urls = urls
    this._loader = loader
  }
  load(cb: (model: Object3D<Event>) => void): void {
    this._loadModels().then((subModels) => {
      const model = new Object3D()
      subModels.forEach((subModel) => {
        model.add(subModel)
      })
      cb(model)
    })
  }

  _loadModels() {
    return Promise.all(
      this._urls.map((url) => {
        return this._loadModel(url)
      })
    )
  }

  private _loadModel(url: string) {
    return new Promise<Object3D>((res) => {
      this._loader.load(url, (gltf) => {
        res(gltf.scene)
      })
    })
  }
}
