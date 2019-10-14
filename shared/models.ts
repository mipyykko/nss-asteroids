import * as Vec2D from "vector2d"
import * as socketio from "socket.io"

export enum InputEventType {
  LEFT,
  RIGHT,
  THRUST,
  FIRE,
}

export enum EventType {
  SERVER_STATE = "serverstate",
  PLAYER_JOIN = "playerjoin",
  PLAYER_PART = "playerpart",
  PLAYER_INPUT = "playerinput",
  PLAYER_UPDATE = "playerupdate",
  CONNECTION = "connection",
  DISCONNECT = "disconnect"
}

export enum EntityType {
  SHIP,
  ASTEROID,
  SHOT,
}

export enum ShipSubType {}

export enum AsteroidSubType {
  LARGE,
  MEDIUM,
  SMALL,
}

export enum ShotSubType {}

export interface IClient {
  id: string
  socket: socketio.Socket
  lastSeenTime: number
  name: string
  points: number
}

export type EntitySubType = ShipSubType | AsteroidSubType | ShotSubType

export interface IEntity {
  id: number
  ownerId: string
  type: EntityType
  subtype: EntitySubType
  position: Vec2D.Vector
  velocity: Vec2D.Vector
  heading: number 
  rotation: number
}

export interface IPlayerInput {
  clientId: string
  time: number
  events: InputEventType[]
}

export interface IPlayerPositionUpdate {
  clientId: string
  time: number
  position: Vec2D.Vector
  velocity: Vec2D.Vector
  heading: Vec2D.Vector
}

export enum GameStatus {
  PAUSED,
  RUNNING,
}

export interface IGameStateUpdate {
  time: number
  status: GameStatus
  clients: IClient[]
  entities: IEntity[]
}
