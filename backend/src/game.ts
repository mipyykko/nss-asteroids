import {
  IClient,
  EntityType,
  IGameStateUpdate,
  AsteroidSubType,
  GameStatus,
  EventType,
  IPlayerInput,
} from "shared/models"
import * as Vec2D from "vector2d"
import { range } from "lodash"
import { IEntityObject } from "./entities/entity"
import { ShipEntity } from "./entities/ship"
import { AsteroidEntity } from "./entities/asteroid"
import * as socketio from "socket.io"

export class Game {
  private readonly updateInterval = 1000 / 60
  private readonly sendUpdateInterval = 1000 / 20
  private clients: { [clientId: string]: IClient }
  private entities: IEntityObject[]
  private width = 6000
  private height = 6000
  private gameState: IGameStateUpdate
  private updating: boolean = false
  private prevGameState: IGameStateUpdate
  private gameUpdateTimeout: NodeJS.Timeout
  private sendUpdateTimeout: NodeJS.Timeout
  private inputQueues: { [clientId: string]: IPlayerInput[] }
  private server: socketio.Server

  constructor(server: socketio.Server) {
    this.server = server

    server.on(EventType.CONNECTION, (socket: socketio.Socket) => {
      const client: IClient = {
        id: socket.id,
        socket,
        lastSeenTime: Date.now(),
        name: "",
        points: 0.0,
      }

      socket.on(EventType.DISCONNECT, () => {
        this.playerPart(this.clients[socket.id])
      })

      this.playerJoin(client)
    })

    const asteroids: IEntityObject[] = range(30).map(
      _ =>
        new AsteroidEntity({
          width: this.width,
          height: this.height,
          subtype:
            Math.random() > 0.8
              ? AsteroidSubType.LARGE
              : Math.random() > 0.8
              ? AsteroidSubType.MEDIUM
              : AsteroidSubType.SMALL,
        }),
    )

    this.entities = Array.from(asteroids)
    this.updateState()
  }

  public update() {
    this.entities.forEach((entity: IEntityObject) => entity.update())

    this.updateState()

    this.gameUpdateTimeout = setTimeout(this.update, this.updateInterval)
  }

  public playerJoin(client: IClient) {
    if (!this.clients[client.id]) {
      this.inputQueues[client.id] = []

      const ship = new ShipEntity({
        ownerId: client.id,
        position: new Vec2D.Vector(
          Math.random() * this.width,
          Math.random() * this.height,
        ),
        heading: 0.0,
        velocity: new Vec2D.Vector(0.0, 0.0),
        rotation: 0,
        inputs: this.inputQueues[client.id],
      })

      client.socket.on(EventType.PLAYER_INPUT, this.handlePlayerInput)
      client.socket.on(EventType.PLAYER_UPDATE, this.handlePlayerUpdate)

      this.entities.push(ship)
      this.clients[client.id] = client
      this.updateState()
    }
  }

  private handlePlayerUpdate() {}

  private playerPart(client: IClient) {
    delete this.clients[client.id]
    this.entities = this.entities.filter(
      (e: IEntityObject) =>
        e.ownerId !== client.id ||
        (e.ownerId === client.id && e.type !== EntityType.SHIP),
    ) // remove only ship
    client.socket.on(EventType.PLAYER_INPUT, () => {})
    client.socket.on(EventType.PLAYER_UPDATE, () => {})

    this.updateState()
  }

  private handlePlayerInput(input: IPlayerInput) {
    this.inputQueues[input.clientId].unshift(input)
  }

  private updateState() {
    this.prevGameState = Object.assign({}, this.gameState)
    this.updating = true

    this.gameState = {
      time: Date.now(),
      status: this.clients.length ? GameStatus.RUNNING : GameStatus.PAUSED,
      clients: Object.values(this.clients),
      entities: this.entities,
    }

    if (this.gameState.status !== this.prevGameState.status) {
      if (this.gameState.status === GameStatus.RUNNING) {
        this.gameUpdateTimeout = setTimeout(this.update, this.updateInterval)
        this.sendUpdateTimeout = setTimeout(
          this.sendGameState,
          this.sendUpdateInterval,
        )
      } else {
        clearTimeout(this.gameUpdateTimeout)
        clearTimeout(this.sendUpdateTimeout)
      }
    }
    this.updating = false
  }

  private sendGameState() {
    const state = Object.assign({}, this.state)

    Object.values(this.clients).forEach((client: IClient) =>
      client.socket.emit(EventType.SERVER_STATE, state),
    )

    this.sendUpdateTimeout = setTimeout(
      this.sendGameState,
      this.sendUpdateInterval,
    )
  }

  private getByType(type: EntityType) {
    return this.entities.filter((entity: IEntityObject) => entity.type === type)
  }

  private get ships() {
    return this.getByType(EntityType.SHIP)
  }

  private get asteroids() {
    return this.getByType(EntityType.ASTEROID)
  }

  public get state() {
    return this.updating ? this.prevGameState : this.gameState
  }
}
