import Vec2D from "vector2d"
import socketio from "socket.io"

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
  shape?: { x: number, y: number }[]
}

export interface IPlayerInput {
  clientId: string
  time: number
  events: InputEventType[]
}

export interface IPlayerPositionUpdate {
  clientId: string
  time: number
  x: number
  y: number
  velocityX: number
  velocityY: number
  heading: number
  rotation: number
}

export enum GameStatus {
  PAUSED,
  RUNNING,
}

export interface IGameStateUpdate {
  time: number
  status: GameStatus
  width: number
  height: number
  clients: IClient[]
  entities: IEntity[]
}

