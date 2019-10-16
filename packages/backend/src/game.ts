import {
  IClient,
  EntityType,
  IGameStateUpdate,
  AsteroidSubType,
  GameStatus,
  EventType,
  IPlayerInput,
} from "shared/dist/models"
import { range} from "lodash"
import { IEntityObject } from "shared/dist/entities/entity"
import { ShipEntity } from "shared/dist/entities/ship"
import { AsteroidEntity } from "shared/dist/entities/asteroid"
import { ShotEntity } from "shared/dist/entities/shot"
import socketio from "socket.io"

export class Game {
  private readonly updateInterval = 1000 / 60
  private readonly sendUpdateInterval = 1000 / 20
  private clients: { [clientId: string]: IClient } = {}
  private entities: IEntityObject[] = []
  private width = 6000
  private height = 6000
  private ASTEROID_COUNT = this.width / 100
  private gameState?: IGameStateUpdate
  private updating: boolean = false
  private prevGameState?: IGameStateUpdate = {
    time: -1,
    status: GameStatus.PAUSED,
    clients: [],
    entities: [],
    height: 0,
    width: 0,
  }
  private gameUpdateTimeout?: NodeJS.Timeout
  private sendUpdateTimeout?: NodeJS.Timeout
  private inputQueues: { [clientId: string]: IPlayerInput[] }
  private server: socketio.Server

  constructor(server: socketio.Server) {
    this.server = server
    this.inputQueues = {}

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

    const asteroids: IEntityObject[] = range(this.ASTEROID_COUNT).map(
      (_) =>
        new AsteroidEntity({
          gameWidth: this.width,
          gameHeight: this.height,
          subtype:
            Math.random() > 0.8
              ? AsteroidSubType.LARGE
              : Math.random() > 0.8
              ? AsteroidSubType.MEDIUM
              : AsteroidSubType.SMALL,
        }),
    )

    this.entities = this.entities.concat(asteroids)
    this.updateState()
  }

  public start() {
    this.gameUpdateTimeout = setInterval(this.update.bind(this), this.updateInterval)
    this.sendUpdateTimeout = setInterval(this.sendGameState.bind(this), this.sendUpdateInterval)
/*     this.gameUpdateTimeout = setTimeout(() => this.update(), this.updateInterval)
    this.sendUpdateTimeout = setTimeout(
      () => this.sendGameState(),
      this.sendUpdateInterval,
    ) */
  }

  public pause() {
    if (this.gameUpdateTimeout) {
      clearTimeout(this.gameUpdateTimeout)
    }
    if (this.sendUpdateTimeout) {
      clearTimeout(this.sendUpdateTimeout)
    }
  }

  private updateState() {
    this.updating = true

    // todo: don't send socket to clients 

    this.gameState = {
      time: Date.now(),
      width: this.width,
      height: this.height,
      status: Object.keys(this.clients).length ? GameStatus.RUNNING : GameStatus.PAUSED,
      clients: Object.values(this.clients),
      entities: this.entities,
    }

    if (this.gameState.status !== this.prevGameState!.status) {
      if (this.gameState.status === GameStatus.RUNNING) {
        this.start()
      } else {
        this.pause()
      }
    }

    this.updating = false
    this.prevGameState = Object.assign({}, this.gameState)
  }

  private update() {
    // tslint:disable-next-line: align whitespace
    (this.entities || []).forEach((entity: IEntityObject) => entity.update())
    this.entities = this.filterDead(this.entities)

    this.updateState()
  }

  private filterDead(entities: IEntityObject[]) {
    return entities.filter((e: IEntityObject) => {
      return e.type !== EntityType.SHOT || (e.type === EntityType.SHOT && !(e as ShotEntity).dead)
    })
  }

  private get isRunning() {
    return this.gameState ? this.gameState.status === GameStatus.RUNNING : false
  }

  private playerJoin(client: IClient) {
    console.log("player joined", client.id)
    if (!this.clients[client.id]) {
      this.inputQueues[client.id] = []

      const ship = new ShipEntity({
        ownerId: client.id,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        heading: 0.0,
        velocityX: 0.0,
        velocityY: 0.0,
        rotation: 0,
        inputs: this.inputQueues[client.id],
        gameWidth: this.width,
        gameHeight: this.height,
        fireCallback: this.fire.bind(this)
      })

      client.socket.on(EventType.PLAYER_INPUT, this.handlePlayerInput.bind(this))
      client.socket.on(EventType.PLAYER_UPDATE, this.handlePlayerUpdate.bind(this))

      this.entities.push(ship)
      this.clients[client.id] = client
      this.updateState()
    }
  }

  private handlePlayerUpdate() {}

  private playerPart(client: IClient) {
    console.log("player parted", client.id)

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
    if (this.inputQueues[input.clientId]) {
      this.inputQueues[input.clientId].unshift(input)
    }
  }

  private fire(shipEntity: ShipEntity) {
    const shot = new ShotEntity({ ...shipEntity, id: undefined })
    this.entities.push(shot)
  }

  private sendGameState() {
    Object.values(this.clients).forEach((client: IClient) => {
      // TODO: send list of players, filter sockets
      const sendableState = { ...this.state, clients: [] }
      client.socket.emit(EventType.SERVER_STATE, sendableState)
    })
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
