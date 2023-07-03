import { GridHelper } from 'three'
import type { Infra, Initiator } from '../App3D'

class IntersectionIgnoreGrid extends GridHelper {
  raycast(): void {
    this._doNothingToIgnoreIntersection()
  }
  _doNothingToIgnoreIntersection() {}
}

export class GridAdder implements Initiator {
  initiate({ scene }: Infra): void {
    const grid = new IntersectionIgnoreGrid(30, 30)
    scene.add(grid)
  }
}
