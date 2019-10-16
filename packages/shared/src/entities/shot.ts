import { EntityType } from "../models"
import { IEntityProps, Entity } from "./entity"

const rotatePoint = (x: number, y: number, rad: number) => {
  const rcos = Math.cos(rad)
  const rsin = Math.sin(rad)
  return { x: x * rcos - y * rsin, y: y * rcos + x * rsin }
}

export interface IShotEntityProps extends IEntityProps {

}

const VELOCITY = 0.1
const MAX_DISTANCE = 10

export class ShotEntity extends Entity {
  public dead: boolean
  public distanceTravelled: number

  constructor(props: IShotEntityProps) {
    const { x, y, heading } = props
    const origin = rotatePoint(x + 10, y, heading)
  
    super({
      ...props,
      id: undefined,
      type: EntityType.SHOT,
      subtype: undefined,
      x: origin.x,
      y: origin.y,
      rotation: 0.0
    })

    this.velocityX = Math.sin(heading  * 0.01745) * VELOCITY
    this.velocityY = Math.sin(heading  * 0.01745) * VELOCITY 
    this.distanceTravelled = 0.0
    this.dead = false
  }

  public update() {
    this.baseUpdate()

    // console.log(this.distanceTravelled)
    this.distanceTravelled += VELOCITY
    
    if (this.distanceTravelled > MAX_DISTANCE) {
      this.dead = true
    }
  }
}