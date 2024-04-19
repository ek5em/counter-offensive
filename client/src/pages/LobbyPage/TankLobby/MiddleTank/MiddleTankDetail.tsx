import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { useSetRoleHandler } from "../../../../hooks/useSetRoleHandler";
import { MediatorContext, ServerContext } from "../../../../App";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import {
    EGamerRole,
    ILobby,
    IMiddleTank,
} from "../../../../modules/Server/interfaces";

import { ReactComponent as MiddleTank } from "./middleTank.svg";
import CrossIcon from "../closeIcon.png";

import styles from "../Detail.module.scss";

const TankDetail: FC = () => {
    const [tank, setTank] = useState<IMiddleTank>({
        Gunner: false,
        Mechanic: false,
        id: 0,
    });
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const setRoleHandler = useSetRoleHandler();

    useEffect(() => {
        const { LOBBY_UPDATE } = mediator.getTriggerTypes();
        mediator.set(LOBBY_UPDATE, () => {
            tankUpdate();
        });
        tankUpdate();
    }, []);

    const tankUpdate = () => {
        const id = Number(params.id);
        if (id) {
            const newTank = server.STORE.getLobby().tanks.middleTank.find(
                (tank) => tank.id === id
            );
            if (newTank) {
                return setTank(newTank);
            }
        }
    };

    const goBack = () => {
        navigate("/middle_tanks");
    };

    const calcPlaces = (): string => {
        const placesCount = 2;
        var occupiedPlacesCount = 0;
        tank.Gunner && occupiedPlacesCount++;
        tank.Mechanic && occupiedPlacesCount++;

        return `${occupiedPlacesCount}/${placesCount}`;
    };

    return (
        <div className={styles.details}>
            <div className={styles.info}>
                <p>Двухместный танк</p>
                <p>Танк {tank.id}</p>
                <p>Занято мест {calcPlaces()}</p>
            </div>
            <div className={cn(styles.svg_wrapper, styles.middle_tank)}>
                <div
                    id={"test_button_shooter2"}
                    onClick={() =>
                        setRoleHandler(
                            EGamerRole.middleTankGunner,
                            tank.id
                        )
                    }
                    className={cn(styles.gunner, {
                        [styles.unavailable]: tank.Gunner,
                    })}
                >
                    Наводчик
                </div>
                <div
                    id={"test_button_tankDriver2"}
                    onClick={() =>
                        setRoleHandler(EGamerRole.middleTankMeh, tank.id)
                    }
                    className={cn(styles.driver, {
                        [styles.unavailable]: tank.Mechanic,
                    })}
                >
                    МехВод
                </div>
                <MiddleTank />
            </div>
            <img
                id={"test_button_cross"}
                className={styles.close}
                src={CrossIcon}
                alt="Закрыть"
                onClick={goBack}
            />
        </div>
    );
};

export default withLayout(TankDetail);
