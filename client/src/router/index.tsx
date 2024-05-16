import { Navigate, RouteProps } from "react-router-dom";
import {
    ErrorPage,
    GamePage,
    LobbyInfo,
    LoginPage,
    RegistrationPage,
    HeavyTankLobby,
    MiddleTankLobby,
    HeavyTankDetail,
    MiddleTankDetail,
} from "../pages";

export enum ERoute {
    auth = "authorization",
    reg = "registration",
    error = "error",
    lobby = "lobby",
    heavyTank = "heavy_tanks",
    middleTank = "middle_tanks",
    game = "game",
}

export const publicRoutes: RouteProps[] = [
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: `/${ERoute.auth}`,
        element: <LoginPage />,
    },
    {
        path: `/${ERoute.reg}`,
        element: <RegistrationPage />,
    },
    {
        path: `/${ERoute.error}`,
        element: <ErrorPage />,
    },
    {
        path: "*",
        element: <Navigate to={`/${ERoute.error}`}  />,
    },
];

export const privateRoutes: RouteProps[] = [
    {
        path: "/",
        element: <LobbyInfo />,
    },
    {
        path: `/${ERoute.lobby}`,
        element: <LobbyInfo />,
    },
    {
        path: `/${ERoute.heavyTank}`,
        element: <HeavyTankLobby />,
    },
    {
        path: `/${ERoute.middleTank}`,
        element: <MiddleTankLobby />,
    },
    {
        path: `/${ERoute.heavyTank}/:id`,
        element: <HeavyTankDetail />,
    },
    {
        path: `/${ERoute.middleTank}/:id`,
        element: <MiddleTankDetail />,
    },
    {
        path: `/${ERoute.game}`,
        element: <GamePage />,
    },
    {
        path: `/${ERoute.error}`,
        element: <ErrorPage />,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
];
