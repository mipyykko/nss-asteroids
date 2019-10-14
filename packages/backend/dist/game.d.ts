import { IGameStateUpdate } from "shared/src/models";
import socketio from "socket.io";
export declare class Game {
    private readonly updateInterval;
    private readonly sendUpdateInterval;
    private clients;
    private entities;
    private width;
    private height;
    private gameState?;
    private updating;
    private prevGameState?;
    private gameUpdateTimeout?;
    private sendUpdateTimeout?;
    private inputQueues;
    private server;
    constructor(server: socketio.Server);
    start(): void;
    private updateState;
    private update;
    private readonly isRunning;
    private playerJoin;
    private handlePlayerUpdate;
    private playerPart;
    private handlePlayerInput;
    private sendGameState;
    private getByType;
    private readonly ships;
    private readonly asteroids;
    readonly state: IGameStateUpdate | undefined;
}
//# sourceMappingURL=game.d.ts.map