import { EntityType, EntitySubType, IEntity } from "shared/models"
import * as Vec2D from "vector2d"

let runningId = 0

export interface IEntityObject extends IEntity {
  update(): void
}

export interface IEntityProps {
  id?: number
  ownerId?: string
  type?: EntityType
  subtype?: EntitySubType
  position: Vec2D.Vector
  velocity: Vec2D.Vector
  heading: number
  rotation: number
}

export abstract class Entity implements IEntityObject {
  public readonly id: number
  public readonly ownerId: string
  public readonly type: EntityType
  public readonly subtype: EntitySubType
  public position: Vec2D.Vector
  public velocity: Vec2D.Vector
  public heading: number
  public rotation: number

  constructor(props: IEntityProps) {
    const { id, position, heading, velocity, rotation, ownerId, type, subtype } = props

    this.id = id ? id : runningId++
    this.position = position
    this.heading = heading
    this.velocity = velocity
    this.rotation = rotation
    this.ownerId = ownerId
    this.type = type
    this.subtype = subtype
  }

  public abstract update(): void
}
