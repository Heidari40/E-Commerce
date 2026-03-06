"use client"

import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "@/src/context";
import { addToCart } from "@/src/services/auth/cart";
import toast from "react-hot-toast";
import { get } from "http";


type ProductType = {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    deliveryInfo: string;
    onSale: string;
    priceDrop: number;
    imageUrl: string;
    sizes: string[];
}




export default function ProductDetails({ item }: { item: ProductType }) {
    const {
        setComponentLevelLoader,
        componentLevelLoader,
        user,
        setShowCartModel,
    } = useContext(GlobalContext);



    async function handleAddToCart(getItem: ProductType){
          setComponentLevelLoader({ loading: true, id:""});

          const res = await addToCart({productID: getItem._id, userID:user?._id, quantity: 1});

          if (res.success) {
            toast.success(res.message);
            setComponentLevelLoader({ loading: false, id: "" });
            setShowCartModel(true);
          } else {
            toast.error(res.message);
            setComponentLevelLoader({ loading: false, id: "" });
          }
          setComponentLevelLoader({ loading: false, id: "" });
          setShowCartModel(true);
         
    }


    return (
        <section className="mx-auto flex max-w-screen-xl px-5 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-row g:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
                <div className="w-full lg:col-span-3 lg:row-end-1">

                    <div className=" flex flex-row lg:order-2 lg:ml-5 ">
                        <div className=" flex flex-row ">
                            <div className="flex flex-col gap-2 px-4">
                                <div className="max-w-xl overflow-hidden border rounded-xl border-gray-100">
                                    <Image
                                        src={item?.imageUrl}
                                        alt={item?.name}
                                        width={100}
                                        height={100}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="lg:flex-col ">
                                    <button
                                        type="button"
                                        className="flex-0 gap-8 aspect-square mb-3 h-20  border-2 rounded-lg border-gray-100 ">
                                        <Image
                                            src={item?.imageUrl}
                                            alt="Product Details"
                                            width={100}
                                            height={100}
                                            className="object-cover border border-gray-100 rounded-lg"
                                        />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-full h-full mx-12 justify-end"
                            >
                                <Image
                                    src={item?.imageUrl}
                                    alt= {item?.name}
                                    className="h-full w-full object-cover border border-gray-100 rounded-lg"
                                    width={600}
                                    height={600}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col lg:col-span-2 lg:row-span-2 lg:row-end p-4">

                    <h1 className="text-2xl font-bold text-gray-300">
                        {item && item?.name}
                    </h1>

                    <div className="mt-9 justify-between flex flex-row items-center justify-between space-y-4 border-t border-b border-gray-300 py-4 sm:flex-row sm:space-y-0">
                        <div className="flex flex-col items-end gap-4 ">
                            <h1
                                className={`text-3xl font-bold ${item.onSale === "yes" ? "line-through " : ""} `}
                            >
                                $ {item && item.price}
                            </h1>
                            {item.onSale === "yes" ?
                                <p className="text-sm font-semibold">
                                    {`-(${item.priceDrop}%) off`}
                                </p>
                                : null}
                            {item.onSale === "yes" ? (
                                <p className=" font-bold text-red-600  text-sm px-4 font-semibold ">
                                    {`$ ${(item.price - (item.price * item.priceDrop / 100)).toFixed(2)}`}
                                </p>
                            ) : null}
                        </div>
                        <button
                           onClick={() => handleAddToCart(item)}
                            type="button"
                            className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium tracking-wide uppercase text-white cursor-pointer rounded-md">
                            Add to Cart
                        </button>
                    </div>
                    <ul className="mt-7 space-y-2">
                        <li
                            className="flex items-center text-left text-sm font-medium text-gray-600">
                            {item && item.deliveryInfo}

                        </li>
                        <li
                            className="flex items-center text-left text-sm font-medium text-gray-600">
                            {"Cancel anytime"}
                        </li>
                    </ul>
                    <div className="lg:col-span-3">
                        <div className="border-b border-gray-300 ">
                            <nav className="flex gap-4">
                                <a
                                    className="border-b border-gray-100 py-4  font-medium "
                                    href="#">
                                    Description</a>
                            </nav>
                        </div>
                        <div className=" flow-root sm:mt-4 ">
                            {item && item.description}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}