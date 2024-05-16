import React, { useEffect, useState } from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar: React.FC = () => {
    const [progress, setProgress] = useState<number>(20);

    useEffect(() => {
        const interval = setInterval(() => {
            const newProgress = progress + Math.round(Math.random() * 15);
            setProgress(newProgress <= 100 ? newProgress : 100);
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, Math.random() * 900);
        return () => {
            clearInterval(interval);
        };
    });
    return (
        <div className={styles.progress_bar}>
            <span>Загрузка...</span>
            <div className={styles.bar}>
                <div
                    className={styles.progress}
                    style={{ width: `${progress}%` }}
                >
                    {progress < 100 && progress > 0 && (
                        <div className={styles.triangle}></div>
                    )}
                </div>
                <span className={styles.progress_num}>{progress}/100%</span>
            </div>
        </div>
    );
};

export default ProgressBar;
