import { AsteroidSubType, EntityType } from "../models"
import { Entity, IEntityProps } from "./entity"

export interface IAsteroidEntityProps {
  gameWidth: number
  gameHeight: number
  subtype: AsteroidSubType
}

export class AsteroidEntity extends Entity {
  constructor(props: IAsteroidEntityProps) {
    const { gameWidth, gameHeight, subtype } = props

    const heading = Math.random() * 360
    const velocityX = Math.sin(heading) * Math.random()
    const velocityY = Math.cos(heading) * Math.random()

    super({
      type: EntityType.ASTEROID,
      x: Math.random() * gameWidth,
      y: Math.random() * gameHeight,
      subtype,
      heading,
      velocityX,
      velocityY,
      rotation: Math.random() * 0.4 - 0.2,
      gameWidth,
      gameHeight,
    })
  }

  public update() {
    this.baseUpdate()
  }
}
