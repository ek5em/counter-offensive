import { MAP_SIZE, objectConf } from "../../../../../config";
import { IGameScene } from "../Game";
import { TCircle, TPoint } from "../../../types";
import { BaseUnit } from "../Units";

class Collision {
    blockUnit(unit: BaseUnit, block: TPoint, width: number, height: number) {
        const centerBlock: TPoint = {
            x: block.x + width / 2,
            y: block.y - height / 2,
        };

        const distance: TPoint = {
            x: unit.x - centerBlock.x,
            y: unit.y - centerBlock.y,
        };

        const sumOfRad: TPoint = {
            x: width / 2 + unit.r,
            y: height / 2 + unit.r,
        };

        if (
            Math.abs(distance.x) < sumOfRad.x &&
            Math.abs(distance.y) < sumOfRad.y
        ) {
            const overlap: TPoint = {
                x: sumOfRad.x - Math.abs(distance.x),
                y: sumOfRad.y - Math.abs(distance.y),
            };

            if (overlap.x < overlap.y) {
                unit.x += distance.x > 0 ? overlap.x : -overlap.x;
            } else {
                unit.y += distance.y > 0 ? overlap.y : -overlap.y;
            }
        }
    }

    circleUnit(unit: BaseUnit, circle: TCircle) {
        const distance: TPoint = {
            x: unit.x - circle.x,
            y: unit.y - circle.y,
        };

        const distanceLength = Math.max(
            Math.sqrt(distance.x ** 2 + distance.y ** 2),
            0.0001
        );

        const sumOfRad: number = circle.r + unit.r;

        if (distanceLength < sumOfRad) {
            const normVect: TPoint = {
                x: distance.x / distanceLength,
                y: distance.y / distanceLength,
            };

            const overlap = sumOfRad - distanceLength;

            unit.x += normVect.x * overlap;
            unit.y += normVect.y * overlap;
        }
    }

    bordersUnit(unit: BaseUnit) {
        const { x, y, r } = unit;
        if (x - r < 0) {
            unit.x = r;
        }
        if (x + r > MAP_SIZE.width) {
            unit.x = MAP_SIZE.width - r;
        }
        if (y - r < 0) {
            unit.y = r;
        }
        if (y + r > MAP_SIZE.height) {
            unit.y = MAP_SIZE.height - r;
        }
    }

    checkAllBlocksUnit(unit: BaseUnit, scene: IGameScene): void {
        const { houses, stones, stumps, sands, spikes } = scene.map.dynamic;
        houses.forEach((house) => {
            const { x, y, sizeX, sizeY } = house;
            this.blockUnit(unit, { x, y }, sizeX, sizeY);
        });

        stones.forEach((stone) => {
            const { x, y } = stone;
            const { r } = objectConf.stone;
            this.circleUnit(unit, { x, y, r });
        });

        stumps.forEach((stump) => {
            const { x, y } = stump;
            const { r } = objectConf.stump;
            this.circleUnit(unit, { x, y, r });
        });

        spikes.forEach((spike) => {
            const { x, y, sizeX, sizeY } = spike;
            this.blockUnit(unit, { x, y }, sizeX, sizeY);
        });
        sands.forEach((sand) => {
        
            const { x, y, sizeX, sizeY, angle } = sand;
            switch (angle) {
                case 0: {
                    this.blockUnit(unit, { x, y }, sizeX, 0.2);
                    break;
                }
                case 90: {
                    this.blockUnit(
                        unit,
                        { x: x + 0.5, y },
                        0.3,
                        sizeY - 0.25
                    );
                    break;
                }
                case 180: {
                    this.blockUnit(
                        unit,
                        { x: x - 0.15, y: y + 0.9 },
                        sizeX,
                        0.3
                    );
                    break;
                }
                case 270: {
                    this.blockUnit(
                        unit,
                        { x: x - 0.3, y },
                        0.3,
                        sizeY - 0.25
                    );
                    break;
                }
                default: {
                    break;
                }
            }
        });

        /*  
        this.scene.bodies.forEach((body) => {
            if (body.type === EBody.heavyTank) {
                this.circleUnit(unit, {
                    ...body,
                    r: entitiesConfig.middleTank.corpusR,
                });
            }
            if (body.type === EBody.middleTank) {
                this.circleUnit(unit, {
                    ...body,
                    r: entitiesConfig.heavyTank.corpusR,
                });
            }
        });
 */
        this.bordersUnit(unit);
    }
}

export default Collision;
