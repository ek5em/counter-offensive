import { FC, ReactNode, createContext } from "react";
import { Mediator, Server } from "../../modules";
import { HOST, MEDIATOR } from "../../config";
import { BrowserRouter } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export const ServerContext = createContext<Server>(null!);
export const MediatorContext = createContext<Mediator>(null!);

export const ContextProvider: FC<Props> = ({ children }) => {
  const mediator = new Mediator(MEDIATOR);
  const server = new Server(HOST, mediator);
  return (
    <BrowserRouter>
      <MediatorContext.Provider value={mediator}>
        <ServerContext.Provider value={server}>
          {children}
        </ServerContext.Provider>
      </MediatorContext.Provider>
    </BrowserRouter>
  );
};
