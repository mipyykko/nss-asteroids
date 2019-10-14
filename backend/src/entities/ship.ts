import { IEntityProps, Entity } from "./entity"
import { EntityType, EventType, IPlayerInput,  InputEventType } from "shared/models"
import * as Vec2D from "vector2d"

interface IShipEntityProps extends IEntityProps {
  type?: EntityType.SHIP,
  inputs: IPlayerInput[]
}

export class ShipEntity extends Entity {
  private readonly inputs: IPlayerInput[]

  constructor(props: IShipEntityProps) {
    super(props)

    this.inputs = props.inputs
  }

  public update() {
    while (this.inputs.length) {
      const input = this.inputs.pop()

      this.rotation = this.isTurningRight(input.events)
        ? 0.05
        : this.isTurningLeft(input.events)
          ? -0.05
          : 0.0
      this.heading += this.rotation

      const acceleration = this.isThrusting(input.events)
        ? new Vec2D.Vector(Math.cos(this.heading) * 1.05, Math.sin(this.heading) * 1.05)
        : new Vec2D.Vector(0.0, 0.0)

      this.velocity.add(acceleration) // times delta time
      this.position.add(this.velocity) // ditto
    }
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
}
