'use client'

import { useContext } from "react";
import { GlobalContext } from "@/src/context";
import { PulseLoader } from "react-spinners";
import { GetAllOrderForAllUsers, UpdateStatusOfOrder } from "@/src/services/auth/order/order";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Image from "next/image";
import ComponentLevelLoader from "@/src/components/Loader/componentlevel";

export default function AdminView() {

    const { user,
        pageLevelLoader,
        setPageLevelLoader,
        componentLevelLoader,
        setComponentLevelLoader,
        allOrdersForAllUsers,
        setAllOrdersForAllUsers
    } = useContext(GlobalContext);



    async function extractAllOrdersForAllUsers() {
        setPageLevelLoader(true);
        const res = await GetAllOrderForAllUsers();

        console.log(res);

        if (res.success) {
            setPageLevelLoader(false);
            setAllOrdersForAllUsers(
                res.data && res.data.length
                    ? res.data.filter((item: any) => item.user._id !== user._id)
                    : []
            );
        } else {
            setPageLevelLoader(false);
        }
    }


    // useEffect(() =>{
    //     console.log(allOrdersForAllUsers, "All orders for all users")
    // },[allOrdersForAllUsers])

    useEffect(() => {
        if (user !== null) extractAllOrdersForAllUsers();
    }, [user]);

    async function handleUpdateOrderStatus(getItem: any) {

        setComponentLevelLoader({
            loading: true,
            id: getItem._id,
        });
       
        try{
            const res = await UpdateStatusOfOrder({
                
            ...getItem,
            isProcessing: false,

            
        });
         
       console.log("det er res console", res);

        if (res.success) {
            extractAllOrdersForAllUsers();
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        }catch(error){
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");

        }finally{
            setComponentLevelLoader({
                loading: false,
                id: "",
            });
        }

        
        

    }

    if (pageLevelLoader) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
                <PulseLoader
                    color="#3b82f6"
                    size={30}
                    loading={pageLevelLoader}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        )
    }

    return (
        <section>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                    <div className="px-4 py-6 sm:px-8 sm:py-10">
                        <div className="flow--root">
                            {allOrdersForAllUsers && allOrdersForAllUsers.length > 0 ? (
                                <ul className="flex flex-col gap-4">
                                    {allOrdersForAllUsers.map((item: any) => (
                                        <li
                                            key={item._id}
                                            className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left rounded-lg">
                                            <div className="flex">
                                                <h1 className="flex-1 text-lg font-semibold mb-3">
                                                    Order ID: {item?._id}
                                                </h1>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-600">
                                                        User:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item?.user?.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-600">
                                                        User Email:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item?.user?.email}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-600">
                                                        Total Paid Amount:
                                                    </p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {item?.totalPrice}
                                                    </p>
                                                    <p>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    item.orderItems.map((orderItem: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="border p-2 mb-2 rounded"
                                                        >
                                                            <Image
                                                                alt="Order Item"
                                                                src={orderItem && orderItem?.Products && orderItem?.Products?.imageUrl || "https://via.placeholder.com/150"}
                                                                className="max-w-full rounded-lg object-cover"
                                                                width={100}
                                                                height={100}
                                                            />

                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="flex gap-5">
                                                <button
                                                   
                                                    className={`disabled:opacity-50 mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide
                                                    ${item.isProcessing 
                                                    ? "bg-yellow-500 text-black"
                                                    : "bg-green-500 text-white"
                                                    }
                                                    disabled:opacity-50
                                                    `}>
                                                    {item.isProcessing
                                                        ? "orders is Processing" 
                                                        : "Order is delivered"}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(item)}
                                                    disabled={!item.isProcessing || componentLevelLoader && componentLevelLoader.loading}
                                                    className="disabled:opacity-50  mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">
                                                    {
                                                        componentLevelLoader && 
                                                        componentLevelLoader.loading &&
                                                            componentLevelLoader.id === item._id ? (
                                                            <ComponentLevelLoader
                                                                text={"Updating order status..."}
                                                                color="#3b82f6"
                                                                size={10}
                                                                loading={componentLevelLoader && 
                                                                componentLevelLoader.loading}

                                                            />
                                                        ) : "Update order status"
                                                    }
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p
                                    className="w-full min-h-screen justify-center items-center flex text-center text-gray-500 text-xl font-semibold"
                                >No orders found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}