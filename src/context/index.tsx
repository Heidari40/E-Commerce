'use client';

import { createContext, use, useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// Når du ikke giver useState en type, så bliver user automatisk any.
// Det betyder:
// - user kan være et objekt
// - eller en string
// - eller null
// - eller hvad du nu end sætter den til


export interface GlobalContextProps {
    user: any;                                        //=> Data om brugeren (kan være hvad som helst)
    setUser: (value: any) => void;
    addresses: any;
    checkoutFormData: any;
    setCheckoutFormData: (value: any) => void;
    setAddresses: (value: any) => void;
    isAuthUser: boolean | null;        
    addressFormData:any;
    setAddressFormData: (value: any) => void;              //“Kan være true, false eller null.”
    setIsAuthedUser: (value: boolean | null) => void;
    allOrdersForUser: any;
    setAllOrdersForUser: (value: any) => void;
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
    addresses: null,
    setAddresses: () => { },
    checkoutFormData: null,
    setCheckoutFormData: () => { },
    addressFormData: null,
    setAddressFormData: () => { },
    allOrdersForUser: null,
    setAllOrdersForUser: () => { },
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

export const initialCheckoutFormData = {
    shippingAddress: {},
    paymentMethod: '',
    totalPrice: 0,
    isPaid: false,
    paidAt: new Date(),
    isProcessing: true

};

const protectedRoutes = ["/cart", "/orders", "/checkout", "/admin-view"];

const protectedAdminRoutes= [
    "/admin-view",
    "/admin-view/add-product",
    "/admin-view/all-products",
]

export default function GlobalState({ children }: { children: React.ReactNode }) {
    const [showNavModel, setShowNavModel] = useState(false);
    const [isAuthUser, setIsAuthedUser] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const [allOrdersForUser, setAllOrdersForUser] = useState<any>(null);
    const [pageLevelLoader, setPageLevelLoader] = useState<boolean>(false);
    const [componentLevelLoader, setComponentLevelLoader] = useState<{ loading: boolean, id: string }>({ loading: false, id: "" });
    const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState<any>(null);
    const [showCartModel, setShowCartModel] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<any>([]);
    const [addresses, setAddresses] = useState<any>([]);
    const [checkoutFormData, setCheckoutFormData] = useState<any>(initialCheckoutFormData);
    const [addressFormData, setAddressFormData] = useState<any>({
        fullName: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
    });
    const router = useRouter();
    const pathName = usePathname();

    
    // - Hvis der ligger en token i browserens cookies → brugeren er (måske) logget ind.
    // - Hvis der ikke ligger en token → brugeren er ikke logget ind.
    // Cookies bruges til auth, fordi de overlever refresh.
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            setIsAuthedUser(true);
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const getCartItems = JSON.parse(localStorage.getItem("cartItems") || "{}");
            setCartItems(getCartItems);
            setUser(userData);

        } else {
            setIsAuthedUser(false);
            setUser({});
        }

    }, []);

    useEffect(() => {
        const isPublic = 
        pathName === "/register" ||
        pathName === "/login" ||
        pathName === "/" ||
        pathName.includes("product");

        // Hvis vi stadig er ved at tjekke auth (null), så gør intet endnu
        if (isAuthUser === null) return;

        if(!isPublic && !isAuthUser && protectedRoutes.includes(pathName)){
            router.push("/login");
        }
    }, [isAuthUser, pathName, router]);

    useEffect(()=> {
        // Vent på at vi ved om brugeren er logget ind
        if (isAuthUser === null) return;

        const isAdminRoute = protectedAdminRoutes.some(route => pathName.startsWith(route));
        const isNotAdmin = user && Object.keys(user).length > 0 && user.role !== "admin";

        if (isAdminRoute && isNotAdmin) {
            router.push("/unauthorized-page")
        }
    }, [user, pathName, isAuthUser, router])


    return (
        //giver adgang til contexten til alle children komponenter
        <GlobalContext.Provider
            value={{

                user,
                setUser,
                addresses,
                setAddresses,
                checkoutFormData,
                setCheckoutFormData,
                addressFormData,
                setAddressFormData,
                allOrdersForUser,
                setAllOrdersForUser,
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
