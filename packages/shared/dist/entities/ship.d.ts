import { IEntityProps, Entity } from "./entity";
import { IPlayerInput } from "../models";
export interface IShipEntityProps extends Omit<IEntityProps, "type"> {
    inputs: IPlayerInput[];
    gameWidth: number;
    gameHeight: number;
    fireCallback: (shipEntity: ShipEntity) => void;
}
export declare class ShipEntity extends Entity {
    private inputs;
    private lastFired?;
    private fireCallback;
    constructor(props: IShipEntityProps);
    setInputs(inputs: IPlayerInput[]): void;
    update(): void;
    private isThrusting;
    private isTurningLeft;
    private isTurningRight;
    private isFiring;
}
//# sourceMappingURL=ship.d.ts.map