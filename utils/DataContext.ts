import { ClassMate, Kelas, Session, User, UserLevel } from "@prisma/client";
import { createContext } from "react";

const DataContext = createContext<Partial<DataContextInterface>>({});

interface DataContextInterface {
    session: (Session & {
        user: {
            classMates: (ClassMate & {
                class: Kelas;
            })[];
            id: string;
            username: string;
            name: string;
            level: UserLevel;
            createdAt: Date;
            updatedAt: Date;
        };
    }) | null
}

export default DataContext;