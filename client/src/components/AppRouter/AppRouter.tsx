import { FC, useContext, useEffect, useState } from "react";
import { Route, RouteProps, Routes, useNavigate } from "react-router-dom";
import { MediatorContext, ServerContext } from "../../App";
import { publicRoutes, privateRoutes } from "../../router";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { IUserInfo } from "../../modules/Server/interfaces";

import styles from "./AppRouter.module.scss";

export const AppRouter: FC = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    const [routes, setRoutes] = useState<RouteProps[]>(
        server.STORE.getToken() ? privateRoutes : publicRoutes
    );
    const navigate = useNavigate();
    const errorHandler = useErrorHandler();

    useEffect(() => {
        errorHandler();

        const { LOGIN, LOGOUT, AUTH_ERROR, THROW_TO_GAME } =
            mediator.getTriggerTypes();

        mediator.set(LOGIN, (user: IUserInfo) => {
            server.STORE.user = user;
            setRoutes(server.STORE.getToken() ? privateRoutes : publicRoutes);
            navigate("/");
        });

        mediator.set(LOGOUT, () => {
            server.STORE.setToken(null);
            setRoutes(publicRoutes);
            navigate("/");
        });

        mediator.set(THROW_TO_GAME, () => {
            navigate("/game");
        });

        mediator.set(AUTH_ERROR, () => {
            mediator.get(LOGOUT);
        });
    }, []);

    return (
        <div className={styles.app}>
            <Routes>
                {routes.map((route) => {
                    return <Route key={route.path} {...route} />;
                })}
            </Routes>
        </div>
    );
};
