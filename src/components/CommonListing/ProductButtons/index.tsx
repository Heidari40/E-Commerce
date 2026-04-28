"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/src/context";
import { useRouter } from "next/navigation";
import ComponentLevelLoader from "../../Loader/componentlevel";
import { deleteProduct } from "@/src/services/auth/product/product";
import { toast } from "react-hot-toast";
import { addToCart } from "@/src/services/auth/cart";




export default function ProductButtons({ item }: { item: any }) {
    const pathName = usePathname();
    const {
        componentLevelLoader,
        setComponentLevelLoader,
        setCurrentUpdatedProduct,
        user,
        showCartModel,
        setShowCartModel,
    } = useContext(GlobalContext);
    const router = useRouter();


    async function handleDeleteProduct(item: any) {
        setComponentLevelLoader({ loading: true, id: item._id });
        const res = await deleteProduct(item._id);

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message);
            router.refresh();
        } else {
            toast.error(res.message);
            setComponentLevelLoader({ loading: false, id: "" });

        }
    }

    const isAdminView = pathName.includes("admin-view");


    async function handelAddToCart(getItem: any) {
        setComponentLevelLoader({ loading: true, id: getItem._id });

        const res = await addToCart({ productID:getItem._id, userID: user._id, quantity: 1 });
    

        if (res.success) {
            toast.success(res.message);
            setComponentLevelLoader({ loading: false, id: "" });
            setShowCartModel(true);
            router.refresh();
        } else {
            toast.error(res.message);
            setComponentLevelLoader({ loading: false, id: "" });
            setShowCartModel(false);
            router.refresh();
        }
        console.log(res);
    }

    return isAdminView ? (
        < >
            <button
                onClick={(() => {
                    setCurrentUpdatedProduct(item);
                    router.push("/admin-view/add-product");
                })}
                className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
                Update
            </button>
            <button
                onClick={(() => {
                    handleDeleteProduct(item);
                })}
                className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
            >
                {componentLevelLoader && componentLevelLoader.loading
                    && item._id === componentLevelLoader.id ? (
                    <ComponentLevelLoader
                        text={"Deleting Product"}
                        color={"#ffff"}
                        loading={componentLevelLoader && componentLevelLoader.loading}
                        size={8}
                    />
                ) : (
                    "Delete"
                )}
            </button>
        </>
    ) : (
        <>
        <button
            onClick={() => handelAddToCart(item)}
            className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
        >
            {componentLevelLoader && componentLevelLoader.loading
                && item._id === componentLevelLoader.id ? (
                    
                    <ComponentLevelLoader
                    text="Adding to cart"
                    color="#ffff"
                    loading = {componentLevelLoader && componentLevelLoader.loading}
                    size={8}
                    
                    />
                    
                ): (
                        "Add to cart"
                        
                    )}

        </button>

        </>

    )
}