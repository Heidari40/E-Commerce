'use client';

import { createContext, useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";

// Når du ikke giver useState en type, så bliver user automatisk any.
// Det betyder:
// - user kan være et objekt
// - eller en string
// - eller null
// - eller hvad du nu end sætter den til


export interface GlobalContextProps {
    user: any;                                        //=> Data om brugeren (kan være hvad som helst)
    setUser: (value: any) => void;
    isAuthUser: boolean | null;                       //“Kan være true, false eller null.”
    setIsAuthedUser: (value: boolean | null) => void;
    cartItems: any;
    setCartItems: (value: any) => void;
    showNavModel: boolean;
    setShowNavModel: (value: boolean) => void;         //void => Denne funktion returnerer ikke noget.
    pageLevelLoader: boolean;
    setPageLevelLoader: (value: boolean) => void;
    componentLevelLoader: { loading: boolean, id: string };
    setComponentLevelLoader: (value: { loading: boolean, id: string }) => void;
    currentUpdatedProduct: any;
    setCurrentUpdatedProduct: (value: any) => void;
    showCartModel: boolean;
    setShowCartModel: (value: any) => void;

}

//createContext er en funktion fra React, der opretter en context. null er bare default value.
//vi bruger til: user ingfo, tema(dark/light), sprog grobale settings.

export const GlobalContext = createContext<GlobalContextProps>({
    user: null,
    setUser: () => { },
    isAuthUser: null,
    cartItems: null,
    setCartItems: () => { },
    setIsAuthedUser: () => { },
    showNavModel: false,
    setShowNavModel: () => { },
    pageLevelLoader: false,
    setPageLevelLoader: () => { },
    componentLevelLoader: { loading: false, id: "" },
    setComponentLevelLoader: () => { },
    currentUpdatedProduct: null,
    setCurrentUpdatedProduct: () => { },
    showCartModel: false,
    setShowCartModel: () => { },
})

export default function GlobalState({ children }: { children: React.ReactNode }) {
    const [showNavModel, setShowNavModel] = useState(false);
    const [isAuthUser, setIsAuthedUser] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const [pageLevelLoader, setPageLevelLoader] = useState<boolean>(false);
    const [componentLevelLoader, setComponentLevelLoader] = useState<{ loading: boolean, id: string }>({ loading: false, id: "" });
    const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState<any>(null);
    const [showCartModel, setShowCartModel] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<any>(null);
    








    // - Hvis der ligger en token i browserens cookies → brugeren er (måske) logget ind.
    // - Hvis der ikke ligger en token → brugeren er ikke logget ind.
    // Cookies bruges til auth, fordi de overlever refresh.
    useEffect(() => {
        if (Cookies.get("token") !== undefined) {
            setIsAuthedUser(true);
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const getCartItems = JSON.parse(localStorage.getItem("cartItems") || "{}");
            setCartItems(getCartItems);
            setUser(userData);

        } else {
            setIsAuthedUser(false);
            setUser({});
        }

    }, [Cookies]);


    return (
        //giver adgang til contexten til alle children komponenter
        <GlobalContext.Provider
            value={{

                user,
                setUser,
                isAuthUser,
                cartItems,
                setCartItems,
                showCartModel,
                setShowCartModel,
                setIsAuthedUser,
                showNavModel,
                setShowNavModel,
                pageLevelLoader,
                setPageLevelLoader,
                componentLevelLoader,
                setComponentLevelLoader,
                currentUpdatedProduct,
                setCurrentUpdatedProduct,
                
            }}>
            {children}
        </GlobalContext.Provider>
    )
}


