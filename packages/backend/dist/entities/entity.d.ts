import { EntityType, EntitySubType, IEntity } from "shared/src/models";
import * as Vec2D from "vector2d";
export interface IEntityObject extends IEntity {
    update(): void;
}
export interface IEntityProps {
    id?: number;
    ownerId?: string;
    type?: EntityType;
    subtype?: EntitySubType;
    position: Vec2D.Vector;
    velocity: Vec2D.Vector;
    heading: number;
    rotation: number;
}
export declare abstract class Entity implements IEntityObject {
    readonly id?: number;
    readonly ownerId?: string;
    readonly type?: EntityType;
    readonly subtype?: EntitySubType;
    position: Vec2D.Vector;
    velocity: Vec2D.Vector;
    heading: number;
    rotation: number;
    constructor(props: IEntityProps);
    abstract update(): void;
}
//# sourceMappingURL=entity.d.ts.map