import { useContext } from "react";
import { privateRoutes, publicRoutes } from "../router";
import { ServerContext } from "../App";

export const useGetRouter = () => {
    const server = useContext(ServerContext);

    return () => {
        return server.STORE.getToken() ? privateRoutes : publicRoutes;
    };
};
