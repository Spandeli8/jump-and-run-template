import { Rectangle } from "./Rectangle.js";
import { canvas } from "./canvas.js";
import { objects, objectsOfType } from "./objects.js";

export class Box extends Rectangle {
    constructor(options, type) {
        const { pos, size, color, grav, friction, vel } = options;
        super({ pos, size, color }, type || "Box");
        this.grav = grav || 0.005;
        this.friction = friction || 0;
        this.vel = vel ? vel : [0, 0];
        this.acc = 0;
        this.onGround = false;
        this.ppos = [...pos];
        this.leftBox = null;
    }

    applyPhysics(deltaTime) {
        this.vel[0] += this.acc * deltaTime;
        this.vel[0] *= 1 - this.friction;
        this.vel[1] += this.grav * deltaTime;
        this.pos[1] += this.vel[1] * deltaTime;
        this.pos[0] += this.vel[0] * deltaTime;
        this.onGround = false;
    }

    update(deltaTime) {
        this.ppos = [...this.pos];
        this.applyPhysics(deltaTime);

        objects.forEach((obj) => {
            this.collideWith(obj).fromAbove();
            this.collideWith(obj).fromBelow();
            this.collideWith(obj).fromLeft();
            this.collideWith(obj).fromRight();
        });

        this.boundToCanvas();
    }

    boundToCanvas() {
        if (this.bottom >= canvas.height) {
            this.vel[1] = 0;
            this.setBottom(canvas.height);
            this.onGround = true;
        }
        if (this.left <= 0) {
            this.setLeft(0);
            this.vel[0] = 0;
        } else if (this.right >= canvas.width) {
            this.setRight(canvas.width);
            this.vel[0] = 0;
        }
    }

    get prevLeft() {
        return this.ppos[0];
    }

    get prevRight() {
        return this.ppos[0] + this.size[0];
    }

    get prevTop() {
        return this.ppos[1];
    }

    get prevBottom() {
        return this.ppos[1] + this.size[1];
    }

    collideWith(obj) {
        return {
            fromLeft: () => {
                if (this === obj) return;
                if (
                    this.prevRight <= obj.left &&
                    this.right >= obj.left &&
                    this.bottom > obj.top &&
                    this.top < obj.bottom
                ) {
                    this.setRight(obj.left);
                }
            },
            fromRight: () => {
                // WORK IN PROGRESS (DOES NOT WORK YET)
                if (this === obj) return;
                if (
                    this.prevLeft >= obj.right &&
                    this.left < obj.right && // was <= before
                    this.bottom > obj.top &&
                    this.top < obj.bottom
                ) {
                    if (obj.type === "Rectangle") {
                        this.setLeft(obj.right);
                        this.vel[0] = 0;
                        return;
                    } else if (obj.type === "Box") {
                        // overlap with box on the left
                        this.leftBox = obj;
                        const distance = obj.right - this.left;
                        const canPush = obj.canBePushedToLeft(distance);
                        if (canPush) {
                            // can push
                            obj.setRight(this.left);
                            if (this.type === "Box") {
                                obj.vel[0] = this.vel[0];
                            }
                        } else {
                            // cannot push
                            this.setLeft(obj.right);
                            this.vel[0] = 0;
                        }
                    }
                }
            },
            fromAbove: () => {
                if (this === obj) return;
                if (
                    this.prevBottom <= obj.top &&
                    this.bottom >= obj.top &&
                    this.right > obj.left &&
                    this.left < obj.right
                ) {
                    this.setBottom(obj.top);
                    this.vel[1] = 0;
                    this.onGround = true;
                }
            },
            fromBelow: () => {
                if (this === obj) return;
                if (
                    this.prevTop >= obj.bottom &&
                    this.top <= obj.bottom &&
                    this.right > obj.left &&
                    this.left < obj.right
                ) {
                    this.setTop(obj.bottom);
                    this.vel[1] = 0;
                }
            },
        };
    }

    // WORK IN PROGRESS (DOES NOT WORK YET)
    canBePushedToLeft(distance) {
        if (this.left < distance) return false;
        if (this.leftBox) {
            return this.leftBox.canBePushedToLeft(distance);
        }
        return objectsOfType.Rectangle.every(
            (rect) => !this.overlapsWith(rect, -distance)
        );
    }
}
