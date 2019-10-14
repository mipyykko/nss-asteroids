import { IEntityProps, Entity } from "./entity";
import { IPlayerInput } from "shared/src/models";
interface IShipEntityProps extends Omit<IEntityProps, "type"> {
    inputs: IPlayerInput[];
}
export declare class ShipEntity extends Entity {
    private readonly inputs;
    constructor(props: IShipEntityProps);
    update(): void;
    private isThrusting;
    private isTurningLeft;
    private isTurningRight;
}
export {};
//# sourceMappingURL=ship.d.ts.map