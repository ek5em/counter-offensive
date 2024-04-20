import { FC, useContext, useEffect, useState } from "react";
import {
    Route,
    RouteProps,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { MediatorContext, ServerContext } from "../../App";
import { publicRoutes, privateRoutes } from "../../router";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { ETank, IToken } from "../../modules/Server/interfaces";

import styles from "./AppRouter.module.scss";

export const AppRouter: FC = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const [routes, setRoutes] = useState<RouteProps[]>(getRouter());
    const navigate = useNavigate();
    const errorHandler = useErrorHandler();
    const location = useLocation();

    useEffect(() => {
        errorHandler();
        server.tokenVerification();
        server.getLobby();
    }, []);

    useEffect(() => {
        const { LOGIN, LOGOUT, AUTH_ERROR, THROW_TO_GAME } =
            mediator.getTriggerTypes();

        const { GO_TO_TANK } = mediator.getEventTypes();

        mediator.subscribe(
            GO_TO_TANK,
            (tank: { tankId: number; tankType: ETank }) => {
                if (
                    Number(location.pathname.split("/").pop()) !== tank.tankId
                ) {
                    navigate(
                        `/${tank.tankType ? "middle_tanks" : "heavy_tanks"}/${
                            tank.tankId
                        }`
                    );
                }
            }
        );

        mediator.set(LOGIN, (data: IToken) => {
            server.STORE.setToken(data.token);
            setRoutes(getRouter());
            server.getUser();
            navigate(location.pathname);
        });

        mediator.set(LOGOUT, () => {
            server.STORE.setToken(null);
            setRoutes(getRouter());
            navigate("/");
        });

        mediator.set(THROW_TO_GAME, () => {
            navigate("/game");
        });

        mediator.set(AUTH_ERROR, () => {
            mediator.get(LOGOUT);
        });
    }, []);

    function getRouter(): RouteProps[] {
        return server.STORE.getToken() ? privateRoutes : publicRoutes;
    }

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
