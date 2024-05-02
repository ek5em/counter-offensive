import { FC, useEffect, useState } from "react";
import {
    Route,
    RouteProps,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useGetRouter } from "../../hooks/useGetRouter";
import { ETank, IGamerInfo, IToken } from "../../modules/Server/interfaces";

import styles from "./AppRouter.module.scss";

export const AppRouter: FC = () => {
    const { server, mediator } = useGlobalContext();
    const getRouter = useGetRouter();
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

        const { GO_TO_TANK, UPDATE_USER, END_GAME } = mediator.getEventTypes();

        mediator.subscribe(END_GAME, () => {
            setTimeout(() => {
                navigate("/");
            }, 3000);
        });

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

        mediator.subscribe(UPDATE_USER, (user: IGamerInfo) => {
            server.STORE.setUser(user);
            // user.is_alive && navigate("/game");
        });

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
