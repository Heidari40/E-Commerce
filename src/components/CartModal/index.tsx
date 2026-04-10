'use client'
import CommonModel from "@/src/components/CommonModel";
import { Fragment, useContext } from "react";
import { GlobalContext } from "@/src/context";
import { getAllCartItems } from "@/src/services/auth/cart";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import ComponentLevelLoader from "@/src/components/Loader/componentlevel";
import { deleteCartItem } from "@/src/services/auth/cart";
import { useRouter } from "next/navigation";
import { set } from "mongoose";


export default function CartModal() {
    const { showCartModel,
        setShowCartModel,
        user,
        setCartItems,
        cartItems,
        componentLevelLoader,
        setComponentLevelLoader
    } = useContext(GlobalContext);

    const router = useRouter();



    async function extractAllCartItems() {
        const res = await getAllCartItems(user?._id); // MongoDB oprette _id

        if (res.success) {
            setCartItems(res.data);
            localStorage.setItem("cartItems", JSON.stringify(res.data)); //Gem cart items i browseren, så de stadig findes, selv hvis brugeren refresher siden.”
        }

    }
    //Fordi API-kald ikke må ske i render-funktionen og burger useEffect.
    useEffect(() => {
        if (user !== null)
            extractAllCartItems();
    }, [user])

    async function handleDelete(getCartItem: any) {
        setComponentLevelLoader({ loading: true, id: getCartItem._id });
        const res = await deleteCartItem(getCartItem._id);

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message);
            extractAllCartItems();

        } else {
            toast.error(res.message);
            setComponentLevelLoader({ loading: false, id: "" });


        }
    }


    return (
        <CommonModel
            showbuttons={true}
            show={showCartModel}
            setShow={setShowCartModel}
            mainContent={
                cartItems && cartItems.length ? (
                    <ul role="list" className=" my-6 divide-y divide-gray-300  ">
                        {
                            cartItems.map((cartItem: any) => (
                                <li key={cartItem._id} >
                                    <div className="flex py-6">
                                        <Image
                                            src={
                                                cartItem &&
                                                cartItem.productID &&
                                                cartItem.productID.imageUrl
                                            }
                                            width={100}
                                            height={100}
                                            alt="cart picturs"
                                            className="w-[100px]  object-cover object-center"
                                        />
                                    </div>
                                    <div className="ml-4 flex felx-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    <a>
                                                        {cartItem &&
                                                            cartItem.productID &&
                                                            cartItem.productID.name}
                                                    </a>
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {cartItem &&
                                                    cartItem.productID &&
                                                    cartItem.productID.price}
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleDelete(cartItem)}
                                            >
                                                {
                                                    componentLevelLoader &&
                                                        componentLevelLoader.loading &&
                                                        componentLevelLoader.id === cartItem._id ? (
                                                        <ComponentLevelLoader
                                                            text="Removeing"
                                                            color="#746008"
                                                            loading={componentLevelLoader && componentLevelLoader.loading}
                                                            size={8}
                                                        />
                                                    ) : (
                                                        "Remove"
                                                        
                                                    )}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                ) : < div className="w-h-scren justify-center text-center ">
                    <h3 className="border  rounded-xl">
                        Empty Cart

                    </h3>
                </div> 
            }
            buttonComponent={
                <Fragment>
                    <button
                        type="button"
                        onClick={() => {router.push("/cart")
                         setShowCartModel(false);
                        }}
                        
                        className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer"
                    > Go To Cart</button>
                    <button

                        //bruges til at deaktivere en knap
                        disabled={cartItems && cartItems.length === 0}
                        type="button"
                        onClick={() => {
                            router.push("/checkout")
                            setShowCartModel(false);
                        }}

                        className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50 cursor-pointer"
                    >Checkout
                    </button>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-600 ">
                        <button
                            className="font-medium  text-gray cursor-pointer transition-all  duration-200 ease-out hover:scale-110 "
                            type="button"
                        >
                            Continue Shopping
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </Fragment>
            }
        />


    );
}
