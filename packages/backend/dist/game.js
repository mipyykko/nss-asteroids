"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("shared/src/models");
const Vec2D = __importStar(require("vector2d"));
const lodash_1 = require("lodash");
const ship_1 = require("./entities/ship");
const asteroid_1 = require("./entities/asteroid");
class Game {
    constructor(server) {
        this.updateInterval = 1000;
        this.sendUpdateInterval = 1000;
        this.clients = {};
        this.entities = [];
        this.width = 6000;
        this.height = 6000;
        this.updating = false;
        this.prevGameState = {
            time: -1,
            status: models_1.GameStatus.PAUSED,
            clients: [],
            entities: [],
        };
        this.inputQueues = {};
        this.server = server;
        server.on(models_1.EventType.CONNECTION, (socket) => {
            const client = {
                id: socket.id,
                socket,
                lastSeenTime: Date.now(),
                name: "",
                points: 0.0,
            };
            socket.on(models_1.EventType.DISCONNECT, () => {
                this.playerPart(this.clients[socket.id]);
            });
            this.playerJoin(client);
        });
        const asteroids = lodash_1.range(5).map((_) => new asteroid_1.AsteroidEntity({
            width: this.width,
            height: this.height,
            subtype: Math.random() > 0.8
                ? models_1.AsteroidSubType.LARGE
                : Math.random() > 0.8
                    ? models_1.AsteroidSubType.MEDIUM
                    : models_1.AsteroidSubType.SMALL,
        }));
        this.entities = this.entities.concat(asteroids);
        this.updateState();
    }
    start() {
        this.gameUpdateTimeout = setInterval(this.update.bind(this), this.updateInterval);
        this.sendUpdateTimeout = setInterval(this.sendGameState.bind(this), this.sendUpdateInterval);
        /*     this.gameUpdateTimeout = setTimeout(() => this.update(), this.updateInterval)
            this.sendUpdateTimeout = setTimeout(
              () => this.sendGameState(),
              this.sendUpdateInterval,
            ) */
    }
    updateState() {
        this.updating = true;
        // todo: don't send socket to clients 
        this.gameState = {
            time: Date.now(),
            status: Object.keys(this.clients).length ? models_1.GameStatus.RUNNING : models_1.GameStatus.PAUSED,
            clients: Object.values(this.clients),
            entities: this.entities,
        };
        /*     if (this.gameState.status !== this.prevGameState!.status) {
              if (this.gameState.status === GameStatus.RUNNING) {
                this.gameUpdateTimeout = setTimeout(this.update, this.updateInterval)
                this.sendUpdateTimeout = setTimeout(
                  this.sendGameState,
                  this.sendUpdateInterval,
                )
              } else {
                if (this.gameUpdateTimeout) {
                  clearTimeout(this.gameUpdateTimeout)
                }
                if (this.sendUpdateTimeout) {
                  clearTimeout(this.sendUpdateTimeout)
                }
              }
            } */
        this.updating = false;
        this.prevGameState = Object.assign({}, this.gameState);
    }
    update() {
        console.log("update?");
        (this.entities || []).forEach((entity) => entity.update());
        this.updateState();
        /*     if (this.isRunning) {
              const self = this
              this.gameUpdateTimeout = setTimeout(() => self.update(), this.updateInterval)
            } */
    }
    get isRunning() {
        return this.gameState ? this.gameState.status === models_1.GameStatus.RUNNING : false;
    }
    playerJoin(client) {
        console.log("player joining?", client.id);
        if (!this.clients[client.id]) {
            console.log("wasn't here!");
            this.inputQueues[client.id] = [];
            const ship = new ship_1.ShipEntity({
                ownerId: client.id,
                position: new Vec2D.Vector(Math.random() * this.width, Math.random() * this.height),
                heading: 0.0,
                velocity: new Vec2D.Vector(0.0, 0.0),
                rotation: 0,
                inputs: this.inputQueues[client.id],
            });
            client.socket.on(models_1.EventType.PLAYER_INPUT, this.handlePlayerInput);
            client.socket.on(models_1.EventType.PLAYER_UPDATE, this.handlePlayerUpdate);
            this.entities.push(ship);
            this.clients[client.id] = client;
            this.updateState();
        }
    }
    handlePlayerUpdate() { }
    playerPart(client) {
        delete this.clients[client.id];
        this.entities = this.entities.filter((e) => e.ownerId !== client.id ||
            (e.ownerId === client.id && e.type !== models_1.EntityType.SHIP)); // remove only ship
        client.socket.on(models_1.EventType.PLAYER_INPUT, () => { });
        client.socket.on(models_1.EventType.PLAYER_UPDATE, () => { });
        this.updateState();
    }
    handlePlayerInput(input) {
        this.inputQueues[input.clientId].unshift(input);
    }
    sendGameState() {
        Object.values(this.clients).forEach((client) => {
            // filter socket
            const sendableState = Object.assign(Object.assign({}, this.state), { clients: [] });
            console.log(JSON.stringify(sendableState));
            // console.log("client id", client.id, state)
            client.socket.emit(models_1.EventType.SERVER_STATE, sendableState);
        });
        /*     const self = this
        
            this.sendUpdateTimeout = setTimeout(
              () => self.sendGameState(),
              this.sendUpdateInterval,
            ) */
    }
    getByType(type) {
        return this.entities.filter((entity) => entity.type === type);
    }
    get ships() {
        return this.getByType(models_1.EntityType.SHIP);
    }
    get asteroids() {
        return this.getByType(models_1.EntityType.ASTEROID);
    }
    get state() {
        return this.updating ? this.prevGameState : this.gameState;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map