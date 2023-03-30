import { Session, User, UserLevel } from "@prisma/client";
import { createContext } from "react";

const DataContext = createContext<Partial<DataContextInterface>>({});

interface DataContextInterface {
    session: (Session & {
        user: User
    })
}

export default DataContext;