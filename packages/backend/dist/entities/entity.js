"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let runningId = 0;
class Entity {
    constructor(props) {
        const { id, position, heading, velocity, rotation, ownerId, type, subtype } = props;
        this.id = id ? id : runningId++;
        this.position = position;
        this.heading = heading;
        this.velocity = velocity;
        this.rotation = rotation;
        this.ownerId = ownerId;
        this.type = type;
        this.subtype = subtype;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map