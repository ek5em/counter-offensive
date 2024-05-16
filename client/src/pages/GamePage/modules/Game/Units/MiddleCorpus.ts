import { TPressedKeys } from "../Game";
import BaseUnit from "./BaseUnit";

export default class MiddleCorpus extends BaseUnit {
    tankRotateSpeed: number;
    constructor(
        x = 5,
        y = 5,
        angle = 0,
        r: number,
        speed: number,
        rotateSpeed: number,
        visiableAngle = 60
    ) {
        super(x, y, angle, r, speed, 0, visiableAngle);
        this.tankRotateSpeed = rotateSpeed;
    }

    move(keyPressed: TPressedKeys, time: number) {
        const moveAngleDelta = Math.PI / 2;

        if (keyPressed.Left) {
            this.angle += this.tankRotateSpeed * time;
        }
        if (keyPressed.Right) {
            this.angle -= this.tankRotateSpeed * time;
        }
        if (keyPressed.Up) {
            this.x += this.speed * Math.sin(this.angle + moveAngleDelta);
            this.y -= this.speed * Math.cos(this.angle + moveAngleDelta);
        }
        if (keyPressed.Down) {
            this.y += this.speed * Math.cos(this.angle + moveAngleDelta);
            this.x -= this.speed * Math.sin(this.angle + moveAngleDelta);
        }
        this.angle = this.angle % (Math.PI * 2);
    }
}
