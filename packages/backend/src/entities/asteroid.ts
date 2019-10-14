import { AsteroidSubType, EntityType } from "shared/src/models"
import { Entity } from "./entity"
import * as Vec2D from "vector2d"

interface IAsteroidEntityProps {
  width: number
  height: number
  subtype: AsteroidSubType
  type?: EntityType.ASTEROID
}

export class AsteroidEntity extends Entity {
  constructor(props: IAsteroidEntityProps) {
    const { width, height, subtype } = props

    const heading = Math.random() * 360
    const velocity = new Vec2D.Vector(Math.cos(heading) * Math.random(), Math.sin(heading) * Math.random())

    super({
      type: EntityType.ASTEROID,
      position: new Vec2D.Vector(Math.random() * width, Math.random() * height),
      subtype,
      heading,
      velocity,
      rotation: Math.random(),
    })
  }

  public update() {
    this.heading += this.rotation
    this.position.add(this.velocity)
  }
}
