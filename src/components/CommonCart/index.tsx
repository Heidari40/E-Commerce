"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ComponentLevelLoader from "../Loader/componentlevel";


interface CommonCartProps {
    cartItems: any[];
    handleDeleteCartItem: (id: string) => void;
    componentLevelLoader: any;
}


// cartItems kommer fra: const cartItems = JSON.parse(localStorage.getItem("cart")); i cartModal
export default function CommonCart({
    cartItems = [],
    handleDeleteCartItem,
    componentLevelLoader,

}: CommonCartProps) {

    const router = useRouter();
    console.log(cartItems, "cartItems for Hamid")





    return (
        <section className=" h-screen bg-gray-100 border border-gray-200">
            <div className="w-[60%] mx-auto px-4  sm:pd-6 lg:px-8 ">
                <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow overflow-hidden ">
                        <div className="px-4 py-6 sm:px-8 sm:py-10">
                            <div className="flow-root">
                                {cartItems && cartItems.length ? (
                                    <ul className="">
                                        {cartItems?.map((cartItem: any) => (
                                            <li
                                                className="flex-col flex space-y-3 py-6 text-left sm:flex-row sm:space-x5 sm:space-y-0"
                                                key={cartItem._id}  >
                                                <div className="shrink-0">
                                                    <Image
                                                        src={
                                                            cartItems &&
                                                            cartItem.productID &&
                                                            cartItem.productID.imageUrl
                                                        }
                                                        width={100}
                                                        height={100}
                                                        alt="cart picturs"
                                                        className=" object-cover object-center rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between ">
                                                    <div className="sm:col-gap-8 sm:grid sm:grid-cols-2">
                                                        <div className="pr-8 sm:pr-4">
                                                            <p className="text-sm text-blu-400 font-semibold text-gray-900">
                                                                {cartItems &&
                                                                    cartItem.productID &&
                                                                    cartItem.productID.name}
                                                            </p>
                                                        </div>
                                                        <div className="mt-4 flex gap-3 items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                                            <p className="shrink-0 w-20 text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right">
                                                                {cartItems &&
                                                                    cartItem.productID &&
                                                                    cartItem.productID.price}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                className="font-medium text-yellow-700 sm:order-2"
                                                                onClick={() => handleDeleteCartItem(cartItem._id)}

                                                            >
                                                                {
                                                                    componentLevelLoader &&
                                                                        componentLevelLoader.lodaing &&
                                                                        componentLevelLoader.id === cartItem._id ? (
                                                                        <ComponentLevelLoader
                                                                            text={"Removing"}
                                                                            color={"#0000"}
                                                                            size={10}
                                                                            loading={
                                                                                componentLevelLoader &&
                                                                                componentLevelLoader.lodading
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        "Remove"
                                                                    )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <h1 className="font-bold text-lg">Your cart is empty</h1>
                                )}
                            </div>
                            <div className="flex flex-row mt-6 justify-between px-8 border-t border-b py-2">
                                <div className="felx items-center justify-between">
                                    <p className="text-sm text-gray-400">Subtotal</p>
                                    <p>
                                        $ {
                                            cartItems &&
                                                cartItems.length ? cartItems.reduce(
                                                    (total, item) => total + item.productID.price,
                                                    0
                                                ) : "0"
                                        }
                                    </p>
                                </div>
                                <div className="felx flex-row items-center justify-between">
                                    <p className="text-sm text-gray-400">
                                        Shipping </p>
                                    <p className="text-lg text-black font-semibold">$0</p>
                                </div>
                                <div className="felx flex-row items-center justify-between">
                                    <p className="text-sm text-gray-400">Total</p>
                                    <p className="text-lg text-black font-semibold">
                                        ${
                                            cartItems &&
                                                cartItems.length ? cartItems.reduce(
                                                    (total, item) => total + item.productID.price,
                                                    0
                                                ) : "0"}
                                    </p>
                                </div>
                               

                            </div>
                             <div>
                                    <button
                                        onClick={() => router.push("/cart")}
                                        className="disabled:opacity-50 group inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide"
                                    >
                                        Chekout
                                    </button>
                                </div>

                        </div>

                    </div>

                </div>

            </div>


        </section>

    );
}