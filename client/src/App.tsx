import { FC, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { Mediator, Server } from "./modules";
import { HOST, MEDIATOR } from "./config";
import { Modal, AppRouter } from "./components";

import "./styles/global.scss";

export const ServerContext = createContext<Server>(null!);
export const MediatorContext = createContext<Mediator>(null!);

const App: FC = () => {
    const mediator = new Mediator(MEDIATOR); 
    const server = new Server(HOST, mediator);

    return (
        <BrowserRouter>
            <MediatorContext.Provider value={mediator}>
                <ServerContext.Provider value={server}>
                    <Modal />
                    <AppRouter />
                </ServerContext.Provider>
            </MediatorContext.Provider>
        </BrowserRouter>
    );
};

export default App;
