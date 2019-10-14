import { AsteroidSubType, EntityType } from "shared/src/models";
import { Entity } from "./entity";
interface IAsteroidEntityProps {
    width: number;
    height: number;
    subtype: AsteroidSubType;
    type?: EntityType.ASTEROID;
}
export declare class AsteroidEntity extends Entity {
    constructor(props: IAsteroidEntityProps);
    update(): void;
}
export {};
//# sourceMappingURL=asteroid.d.ts.map