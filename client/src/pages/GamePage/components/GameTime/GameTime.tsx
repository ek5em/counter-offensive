import { FC, useContext, useEffect, useState } from "react";
import { MediatorContext } from "../../../../App";

import styles from "./GameTime.module.scss";

const GameTime: FC = () => {
    const mediator = useContext(MediatorContext);
    const { UPDATE_TIME } = mediator.getTriggerTypes();
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        mediator.set(UPDATE_TIME, (time: number) => {
            setTime(time);
        });
    });

    const timeConvert = (ms: number): string => {
        const min = Math.floor((ms / (1000 * 60)) % 60);
        const sec = Math.floor((ms / 1000) % 60);
        const formMin = min < 10 ? `0${min}` : `${min}`;
        const formSec = sec < 10 ? `0${sec}` : `${sec}`;
        return `${formMin}:${formSec}`;
    };

    return (
        <div className={styles.time}>
            <span>{timeConvert(time)}</span>
        </div>
    );
};

export default GameTime;
