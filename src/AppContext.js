import { createContext, useContext } from "react";

export const AppContext = createContext(null);

/** { page, section, navigate(page, section?), toast(msg), brand, setBrand(brand) } */
export const useApp = () => useContext(AppContext);
