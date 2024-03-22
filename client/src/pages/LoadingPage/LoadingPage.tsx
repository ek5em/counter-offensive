import React from "react";
import { ProgressBar, CardAdvise, Logo } from "../../components";

import styles from "./LoadingPage.module.scss";

const LoadingPage: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <Logo />
            <CardAdvise />
            <ProgressBar />
        </div>
    );
};

export default LoadingPage;
