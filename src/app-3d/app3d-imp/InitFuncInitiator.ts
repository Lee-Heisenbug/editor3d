import type { Infra, Initiator } from '../App3D'

type InitFunc = (infra: Infra) => void

export class InitFuncInitiator implements Initiator {
  private _initFuncs: InitFunc[]

  constructor(initFuncs: InitFunc[]) {
    this._initFuncs = initFuncs
  }

  initiate(infra: Infra): void {
    this._initFuncs.forEach((initFunc) => {
      initFunc(infra)
    })
  }
}
