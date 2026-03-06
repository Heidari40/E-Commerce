'use client'

import CommonCart from "@/src/components/CommonCart";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/src/context";
import { PulseLoader } from "react-spinners";
import {deleteCartItem} from "@/src/services/auth/cart"
import { toast } from "react-toastify";
import { getAllCartItems } from "@/src/services/auth/cart";






export default function Cart() {
    const { cartItems,
        user,
        setCartItems,
        componentLevelLoader,
        setComponentLevelLoader,
        pageLevelLoader,
        setPageLevelLoader 
        } = useContext(GlobalContext);


        async function extractAllCartItems() {
        setPageLevelLoader(true);
        const res = await getAllCartItems(user?._id);

        if (res.success) {
            setCartItems(res.data);
        }
        setPageLevelLoader(false);
        }


        useEffect(() => {
            if(user !== null) extractAllCartItems();
        }, [user]);

    async function handleDeleteCartItem(getCartItemID: string) {
        setComponentLevelLoader({loading: true, id: getCartItemID})
        const res = await deleteCartItem(getCartItemID);

        if(res.success){
            setComponentLevelLoader({loading: false, id: ""})
            toast.success(res.message);
            extractAllCartItems();


        }else{
            toast.error(res.message)
            setComponentLevelLoader({loading: false, id: ""})
        }
    }

    if (pageLevelLoader) {
        return (
            <div>
                <PulseLoader
                    color={"#0000"}
                    loading={pageLevelLoader}
                    size={10}
                    data-testid="loader"

                />
            </div>
        )
    }


    return (
        <CommonCart
            componentLevelLoader={componentLevelLoader}
            handleDeleteCartItem={handleDeleteCartItem}
            cartItems={cartItems}

        />
    );
}
