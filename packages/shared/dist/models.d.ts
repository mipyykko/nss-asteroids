import socketio from "socket.io";
export declare enum InputEventType {
    LEFT = 0,
    RIGHT = 1,
    THRUST = 2,
    FIRE = 3
}
export declare enum EventType {
    SERVER_STATE = "serverstate",
    PLAYER_JOIN = "playerjoin",
    PLAYER_PART = "playerpart",
    PLAYER_INPUT = "playerinput",
    PLAYER_UPDATE = "playerupdate",
    CONNECTION = "connection",
    DISCONNECT = "disconnect"
}
export declare enum EntityType {
    SHIP = 0,
    ASTEROID = 1,
    SHOT = 2
}
export declare enum ShipSubType {
}
export declare enum AsteroidSubType {
    LARGE = 0,
    MEDIUM = 1,
    SMALL = 2
}
export declare enum ShotSubType {
}
export interface IClient {
    id: string;
    socket: socketio.Socket;
    lastSeenTime: number;
    name: string;
    points: number;
}
export declare type EntitySubType = ShipSubType | AsteroidSubType | ShotSubType;
export interface IEntity {
    id?: number;
    ownerId?: string;
    type?: EntityType;
    subtype?: EntitySubType;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    heading: number;
    rotation: number;
    shape?: {
        x: number;
        y: number;
    }[];
}
export interface IPlayerInput {
    clientId: string;
    time: number;
    events: InputEventType[];
}
export interface IPlayerPositionUpdate {
    clientId: string;
    time: number;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    heading: number;
    rotation: number;
}
export declare enum GameStatus {
    PAUSED = 0,
    RUNNING = 1
}
export interface IGameStateUpdate {
    time: number;
    status: GameStatus;
    width: number;
    height: number;
    clients: IClient[];
    entities: IEntity[];
}
//# sourceMappingURL=models.d.ts.map