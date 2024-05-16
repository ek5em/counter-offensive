import { privateRoutes, publicRoutes } from "../router";
import { useGlobalContext } from "./useGlobalContext";

export const useGetRouter = () => {
    const { server } = useGlobalContext();
    return () => {
        return server.STORE.getToken() ? privateRoutes : publicRoutes;
    };
};
