import {
  EntityType,
  EntitySubType,
  IEntity,
} from "../models"

let runningId = 0

export interface IEntityObject extends IEntity {
  update(): void
}

export interface IEntityProps {
  id?: number
  ownerId?: string
  type?: EntityType
  subtype?: EntitySubType
  x: number
  y: number
  velocityX: number
  velocityY: number
  heading: number
  rotation: number
  gameWidth: number
  gameHeight: number
  shape?: Array<{ x: number; y: number }>
}

export abstract class Entity implements IEntityObject {
  public readonly id?: number
  public readonly ownerId?: string
  public readonly type?: EntityType
  public subtype?: EntitySubType
  public x: number
  public y: number
  public velocityX: number
  public velocityY: number
  public heading: number
  public rotation: number

  public readonly gameWidth: number
  public readonly gameHeight: number

  constructor(props: IEntityProps) {
    const {
      id,
      x,
      y,
      heading,
      velocityX,
      velocityY,
      rotation,
      ownerId,
      type,
      subtype,
      gameWidth,
      gameHeight,
    } = props

    this.id = id ? id : runningId++
    this.x = x
    this.y = y
    this.heading = heading
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.rotation = rotation
    this.ownerId = ownerId
    this.type = type
    this.subtype = subtype
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
  }

  public abstract update(): void

  public setValues(values: IEntityProps) {
    const { x, y, heading, velocityX, velocityY, rotation, subtype } = values

    this.x = x
    this.y = y
    this.heading = heading
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.rotation = rotation
    this.subtype = subtype
  }

  public baseUpdate() {
    this.heading += this.rotation
    this.x += this.velocityX
    this.y -= this.velocityY

    if (this.x < 0) {
      this.x += this.gameWidth
    }
    if (this.y < 0) {
      this.y += this.gameHeight
    }
    if (this.x > this.gameWidth) {
      this.x = this.x % this.gameWidth
    }
    if (this.y > this.gameHeight) {
      this.y = this.y % this.gameHeight
    }
  }
}
