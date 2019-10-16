import { AsteroidSubType } from "../models";
import { Entity } from "./entity";
export interface IAsteroidEntityProps {
    gameWidth: number;
    gameHeight: number;
    subtype: AsteroidSubType;
}
export declare class AsteroidEntity extends Entity {
    constructor(props: IAsteroidEntityProps);
    update(): void;
}
//# sourceMappingURL=asteroid.d.ts.map