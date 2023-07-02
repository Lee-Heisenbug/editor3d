import { GridHelper } from 'three'
import type { Infra, Initiator } from '../App3D'

export class GridAdder implements Initiator {
  initiate({ scene }: Infra): void {
    const grid = new GridHelper(30, 30)
    scene.add(grid)
  }
}
