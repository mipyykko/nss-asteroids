import { IEntityProps, Entity } from "./entity";
export interface IShotEntityProps extends IEntityProps {
}
export declare class ShotEntity extends Entity {
    dead: boolean;
    distanceTravelled: number;
    constructor(props: IShotEntityProps);
    update(): void;
}
//# sourceMappingURL=shot.d.ts.map