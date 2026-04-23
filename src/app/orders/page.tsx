"use client"

import { useContext, useEffect } from "react";
import { GlobalContext } from "@/src/context";
import { useRouter } from "next/navigation";
import { GetAllOrdersForUser } from "@/src/services/auth/order/order";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import Image from "next/image";

export default function Orders() {


    const { user, pageLevelLoader, setPageLevelLoader, allOrdersForUser, setAllOrdersForUser } = useContext(GlobalContext);
    const router = useRouter();




    async function extractAllOrders() {
        if (!user || !user._id) {
            toast.error("User not found. Please log in again.");
            return;
        }
        setPageLevelLoader(true);

        const res = await GetAllOrdersForUser(user?._id);
      

        if (res?.success) {
            setAllOrdersForUser(res.data);
            setPageLevelLoader(false);
        } else {
            setPageLevelLoader(false);
            toast.error(res.message);
        }
    }
    


    useEffect(() => {

        if (user !== null) {
            extractAllOrders();
        }
    }, [user]);


    if (pageLevelLoader) {
        return (
            <div className="w-full min-h-screen flex item-center justify-center">
                <PulseLoader
                    color="#000"
                    size={10}
                    className="my-4"
                    loading={pageLevelLoader}
                    data-testid="loader"

                />
            </div>
        )
    }

    return (
        <section >
            <div className="mx-auto px-4 sm:px-6 lg:px-8  ">
                <div className="mt-8 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
                    <div className="px-4 py-6 sm:px-8 sm:py-10">
                        <div className="flow-root">
                            <div>
                                {allOrdersForUser && allOrdersForUser.length ? (

                                    <ul>
                                        {allOrdersForUser.map((item: any) => (
                                            <li key={item._id}
                                                className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left"
                                            >
                                                <div className="flex">
                                                    <h1 className="font-bold text-lg mb-3 flex-1">
                                                        #order: {item._id}
                                                    </h1>
                                                    <div className="flex item-center">
                                                        <p className="mr-3 text-sm font-medium text-gray-900">
                                                            Total paid amount
                                                        </p>
                                                        <p className="mr-3 text-2xl font-semibold text-gray-900">
                                                            ${item.totalPrice.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-5">
                                                    {item.orderItems.map((orderItem: any, index: any) => (
                                                        <div key={index} className="shrink-0">
                                                            <Image
                                                                alt={"order Item"}
                                                                src={orderItem.product && orderItem.product.imageUrl ? orderItem.product.imageUrl : "/placeholder-image.png"}
                                                                width={100}
                                                                height={100}
                                                                className="w-20 h-20 rounded-lg object-cover"

                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-5">
                                                    <button  className="ml-5  inline-block bg-black  text-white text-xs px-5 py-3  font-semibold uppercase hover:bg-gray-800 transition-all">
                                                        {item.isProcessing
                                                            ? "Order is Processing"
                                                            : "Order is delivered"}
                                                    </button>
                                                    <button onClick={() => router.push(`/orders/${item._id}`)}
                                                        className="ml-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-semibold uppercase hover:bg-gray-800 transition-all"
                                                    >
                                                        View Order Details
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : allOrdersForUser === null ? (
                                    <div className="flex flex-col items-center justify-center py-10">
                                        <p className="text-lg font-medium">Henter dine ordrer...</p>
                                    </div>
                                ) : (
                                    <p>No orders found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}