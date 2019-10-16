import {
  IClient,
  IGameStateUpdate,
  IPlayerInput,
  EventType,
  AsteroidSubType,
  EntityType,
} from "shared/dist/models"
import { IEntityObject, Entity } from "shared/dist/entities/entity"
import { AsteroidEntity } from "shared/dist/entities/asteroid"
import { ShipEntity } from "shared/dist/entities/ship"
import { ShotEntity } from "shared/dist/entities/shot"
import socketIOClient from "socket.io-client"
import { InputHandler } from "./inputHandler"

export interface ILocalGameState {
  time: number
  width: number
  height: number
  clients: IClient[]
  entities: Entity[]
}

export class Game {
  private readonly updateInterval = 1000 / 60
  private readonly sendUpdateInterval = 1000 / 10
  private serverGameState?: IGameStateUpdate
  private localGameState?: ILocalGameState
  private width?: number
  private height?: number
  private socket?: SocketIOClient.Socket
  private inputHandler?: InputHandler
  private ownShip?: ShipEntity
  private inputQueue: IPlayerInput[]
  private xScale?: number
  private yScale?: number
  private stageWidth: number
  private stageHeight: number
  private updateTimeout?: NodeJS.Timeout
  private sendUpdateTimeout?: NodeJS.Timeout

  constructor(stageWidth: number, stageHeight: number) {
    this.stageWidth = stageWidth
    this.stageHeight = stageHeight

    this.inputQueue = []
  }

  connect() {
    if (!this.socket) {
      this.socket = socketIOClient.connect("http://localhost:4000")

      this.inputHandler = new InputHandler()
      this.inputHandler.setSocket(this.socket)
      this.inputHandler.setKeyboardCallback(this.addToInputQueue.bind(this))

      this.initSocketEvents()
    }
  }

  disconnect() {
    if (this.inputHandler) {
      this.inputHandler.close()
    }

    if (this.updateTimeout) {
      clearInterval(this.updateTimeout)
    }
    if (this.sendUpdateTimeout) {
      clearInterval(this.sendUpdateTimeout)
    }

    if (!this.socket) {
      return
    }

    this.socket.disconnect()

    delete this.socket
  }

  initSocketEvents() {
    this.socket!.on(EventType.SERVER_STATE, (newState: IGameStateUpdate) => {
      this.serverGameState = newState

      if (!this.width) {
        this.width = this.serverGameState.width
        this.height = this.serverGameState.height
        this.xScale = this.stageWidth / this.width
        this.yScale = this.stageHeight / this.height
      }

      this.syncStateFromServer(newState)
    })

    this.updateTimeout = setInterval(
      this.update.bind(this),
      this.updateInterval,
    )
    this.sendUpdateTimeout = setInterval(
      this.sendUpdate.bind(this),
      this.sendUpdateInterval,
    )
  }

  isOwnShip(id: string) {
    return this.socket ? id === this.socket.id : false
  }

  syncStateFromServer(state: IGameStateUpdate) {
    if (!state) {
      return
    }

    const { time, width, height, clients, entities } = state

    const serverEntityMap = (entities as Entity[]).reduce(
      (acc, curr) => ({ ...acc, [curr.id!]: curr }),
      {} as { [id: number]: Entity },
    )
    const serverEntityIds = Object.keys(serverEntityMap).map(s => Number(s))

    let localEntities: Entity[] = this.localGameState
      ? this.localGameState.entities.reduce(
          (acc, curr: Entity) => {
            if (!serverEntityIds.includes(curr.id!)) {
              return acc
            }

            if (curr.type === EntityType.SHOT && (curr as ShotEntity).dead) {
              return acc
            }

            curr.setValues(serverEntityMap[curr.id!])
            return [...acc, curr]
          },
          [] as Entity[],
        )
      : []
    const localEntityIds = localEntities.map(e => e.id)

    const newEntities = Object.values(serverEntityMap)
      .map((e: Entity): Entity | undefined => {
        if (localEntityIds.includes(e.id)) {
          return undefined
        }
        if (e.type === EntityType.SHIP) {
          const ownShip = this.isOwnShip(e.ownerId!)

          const ship = new ShipEntity({
            ...e,
            gameWidth: this.width!,
            gameHeight: this.height!,
            inputs: ownShip ? this.inputQueue : [],
            fireCallback: ownShip ? this.fire.bind(this) : () => {}
          })

          if (ownShip) {
            this.ownShip = ship
          }

          return ship
        }
        if (e.type === EntityType.ASTEROID) {
          return new AsteroidEntity({
            ...e,
            subtype: e.subtype! as AsteroidSubType,
            gameWidth: this.width!,
            gameHeight: this.height!,
          })
        }
        if (e.type === EntityType.SHOT && !(e as ShotEntity).dead) {
          return new ShotEntity({
            ...e,
            gameWidth: this.width!,
            gameHeight: this.height!
          })
        }
        return undefined
      })
      .filter((e): e is Entity => !!e)

    localEntities = localEntities.concat(newEntities)

    this.localGameState = {
      time,
      width,
      height,
      clients,
      entities: localEntities,
    }
  }

  fire(shipEntity: ShipEntity) {
    const shot = new ShotEntity({ ...shipEntity, id: undefined })
    if (this.localGameState) {
      this.localGameState.entities.push(shot)
    }
  }

  addToInputQueue(input: IPlayerInput) {
    if (!this.inputQueue) {
      // just to make sure
      this.inputQueue = []
      this.ownShip!.setInputs(this.inputQueue)
    }
    this.inputQueue.unshift(input)
  }

  getSocketId() {
    return this.socket ? this.socket.id : ""
  }

  update() {
    this.inputHandler!.update()

    if (!this.localGameState) {
      return
    }

    ;(this.localGameState.entities || []).forEach((entity: IEntityObject) =>
      entity.update(),
    )

    this.updateState()
  }

  updateState() {
    if (!this.localGameState) {
      return
    }

    this.localGameState = {
      ...this.localGameState!,
      time: Date.now(),
    }
  }

  sendUpdate() {}

  getState() {
    return this.localGameState
  }

  isRunning() {
    return this.socket !== undefined
  }
}
