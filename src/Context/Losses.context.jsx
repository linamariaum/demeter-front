import { createContext, useContext, useState } from "react";
import { getLossesRequest, getLossRequest, createLossRequest } from '../Api/Losses.request.js';

const LossesContext = createContext();

export const useLosses = () => {
    const context = useContext(LossesContext);

    if (!context)
        throw new Error("Ha ocurrido un error con el uso del contexto de las pérdidas");

    return context;
}

export function Losses({ children }) {
    const [losses, setLosses] = useState([]);

    const getLosses = async () => {
        try {
            const res = await getLossesRequest();
            setLosses(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getLoss = async (id) => {
        try {
            const res = await getLossRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    const createLoss = async (loss) => {
        try {
            const res = await createLossRequest(loss);
            getLosses(res);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <LossesContext.Provider value={{
            losses,
            getLosses,
            getLoss,
            createLoss
        }}>
            {children}
        </LossesContext.Provider>
    );
}
