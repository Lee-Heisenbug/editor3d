import type { Infra, Initiator } from '../App3D'

export class InitiatorComposite implements Initiator {
  private _initiators: Initiator[]
  constructor(initiators: Initiator[]) {
    this._initiators = initiators
  }
  initiate(infra: Infra): void {
    this._initiators.forEach((initiator) => {
      initiator.initiate(infra)
    })
  }
}
