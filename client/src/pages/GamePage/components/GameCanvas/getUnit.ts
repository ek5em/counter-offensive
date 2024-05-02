import { entitiesConfig } from "../../../../config";
import { EGamerRole, IUserUnit } from "../../../../modules/Server/interfaces";
import {
    Bannerman,
    BaseUnit,
    General,
    HeavyCorpus,
    HeavyTower,
    Infantry,
    InfantryRPG,
    MiddleCorpus,
    MiddleTower,
    TankCommander,
} from "../../modules";

export const getUnit = (user: IUserUnit | null = null) => {
    if (user) {
        const { x, y, angle } = user;
        switch (user.personId) {
            case EGamerRole.infantryRPG: {
                const { r, speed, weaponLength, visiableAngle } =
                    entitiesConfig.infantryRGP;
                return new InfantryRPG(
                    x,
                    y,
                    angle,
                    r,
                    speed,
                    weaponLength,
                    visiableAngle
                );
            }
            case EGamerRole.middleTankGunner: {
                const {
                    rotateTowerSpeed,
                    weaponLength,
                    towerR,
                    visiableAngle,
                } = entitiesConfig.middleTank;
                return new MiddleTower(
                    x,
                    y,
                    angle,
                    towerR,
                    rotateTowerSpeed,
                    weaponLength,
                    visiableAngle.gunner
                );
            }
            case EGamerRole.middleTankMeh: {
                const { corpusR, rotateSpeed, speed, visiableAngle } =
                    entitiesConfig.middleTank;
                return new MiddleCorpus(
                    x,
                    y,
                    angle,
                    corpusR,
                    speed,
                    rotateSpeed,
                    visiableAngle.driver
                );
            }
            case EGamerRole.heavyTankGunner: {
                const {
                    rotateTowerSpeed,
                    weaponLength,
                    towerR,
                    visiableAngle,
                } = entitiesConfig.heavyTank;
                return new HeavyTower(
                    x,
                    y,
                    angle,
                    towerR,
                    rotateTowerSpeed,
                    weaponLength,
                    visiableAngle.gunner
                );
            }

            case EGamerRole.heavyTankMeh: {
                const { corpusR, rotateSpeed, speed, visiableAngle } =
                    entitiesConfig.heavyTank;
                return new HeavyCorpus(
                    x,
                    y,
                    angle,
                    corpusR,
                    speed,
                    rotateSpeed,
                    visiableAngle.driver
                );
            }

            case EGamerRole.heavyTankCommander: {
                const { visiableAngle } = entitiesConfig.heavyTank;
                return new TankCommander(x, y, angle, visiableAngle.comander);
            }
            case EGamerRole.bannerman: {
                const { r, speed } = entitiesConfig.bannerman;
                return new Bannerman(x, y, angle, r, speed, 0);
            }
            case EGamerRole.general: {
                const { speed } = entitiesConfig.general;
                return new General(x, y, angle, speed);
            }

            default: {
                const { r, speed, weaponLength } = entitiesConfig.infantry;
                return new Infantry(x, y, angle, r, speed, weaponLength);
            }
        }
    }
    return new BaseUnit();
};
