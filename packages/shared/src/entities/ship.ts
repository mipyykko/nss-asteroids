import { IEntityProps, Entity } from "./entity"
import {
  EntityType,
  EventType,
  IPlayerInput,
  InputEventType,
} from "../models"

export interface IShipEntityProps extends Omit<IEntityProps, "type"> {
  inputs: IPlayerInput[]
  gameWidth: number
  gameHeight: number
  fireCallback: (shipEntity: ShipEntity) => void
}

const ROTATION = 0.2
const ACCELERATION = 1.05
const FIRE_DELAY = 10

export class ShipEntity extends Entity {
  private inputs: IPlayerInput[]
  private lastFired?: number
  private fireCallback: (shipEntity: ShipEntity) => void

  constructor(props: IShipEntityProps) {
    super({ ...props, type: EntityType.SHIP })

    const { inputs, fireCallback } = props
    this.inputs = inputs
    this.fireCallback = fireCallback
  }

  public setInputs(inputs: IPlayerInput[]) {
    this.inputs = inputs
  }

  public update() {
    while (this.inputs.length) {
      const input = this.inputs.pop()

      if (!input) {
        continue
      }

      const { events, time } = input

      this.rotation += this.isTurningRight(events)
        ? ROTATION
        : this.isTurningLeft(events)
        ? -ROTATION
        : 0.0

      const accelerationX = this.isThrusting(events) ? Math.sin(this.heading * 0.01745) * ACCELERATION : 0.0
      const accelerationY = this.isThrusting(events) ? Math.cos(this.heading * 0.01745) * ACCELERATION : 0.0

      this.velocityX += accelerationX
      this.velocityY += accelerationY

      if (this.isFiring(events) && (!this.lastFired || time > this.lastFired + FIRE_DELAY)) {
        this.lastFired = time
        // this.fireCallback(this)
      }
    }
    this.baseUpdate()
  }

  private isThrusting(inputs: InputEventType[]) {
    return inputs.includes(InputEventType.THRUST)
  }

  private isTurningLeft(inputs: InputEventType[]) {
    return inputs.includes(InputEventType.LEFT)
  }

  private isTurningRight(inputs: InputEventType[]) {
    return inputs.includes(InputEventType.RIGHT)
  }

  private isFiring(inputs: InputEventType[]) {
    return inputs.includes(InputEventType.FIRE)
  }
}
