import { EntityType, EntitySubType, IEntity } from "../models";
export interface IEntityObject extends IEntity {
    update(): void;
}
export interface IEntityProps {
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
    gameWidth: number;
    gameHeight: number;
    shape?: Array<{
        x: number;
        y: number;
    }>;
}
export declare abstract class Entity implements IEntityObject {
    readonly id?: number;
    readonly ownerId?: string;
    readonly type?: EntityType;
    subtype?: EntitySubType;
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    heading: number;
    rotation: number;
    readonly gameWidth: number;
    readonly gameHeight: number;
    constructor(props: IEntityProps);
    abstract update(): void;
    setValues(values: IEntityProps): void;
    baseUpdate(): void;
}
//# sourceMappingURL=entity.d.ts.map