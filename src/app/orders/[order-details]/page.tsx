"use client"

import { useContext, useEffect } from "react";
import { GlobalContext } from "@/src/context";
import { useParams, useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { GetOrderDetails } from "@/src/services/auth/order/order";
import Image from "next/image";


export default function OrderDetails() {
    const { user, pageLevelLoader, setPageLevelLoader, orderDetails, setOrderDetails } = useContext(GlobalContext);
    const router = useRouter();
    const params = useParams();






    async function extractOrderDetails() {

        setPageLevelLoader(true);

        if (!user || !user._id) {
            toast.error("User not found. Please log in again.");
            setPageLevelLoader(false);
            return;
        }

        // Brug ID fra URL'en (params['order-details'])
        const res = await GetOrderDetails(params['order-details'] as string);

        console.log(res, "res console.loggggg");

        if (res.success) {
            setOrderDetails(res.data);
            setPageLevelLoader(false);
            toast.success("Order details fetched successfully");
        } else {
            setPageLevelLoader(false);
            toast.error(res.message);
        }
    }

    useEffect(() => {
         console.log(params, "params");
        if (
           
            user &&
            params['order-details'] // Tjek at ID er tilgængeligt i URL'en
        ) {
            extractOrderDetails();
        }



    }, [user, params['order-details']]); // Tilføj params som dependency

  
    if (pageLevelLoader) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
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
        <div className="py-8 px-4 md:px-6">
            <div className="flex justify-start items-start space-y-2 flex-col">
                <h1
                    className="text-3xl lg:text-4xl font-bold leading-7 lg:leading-9 text-gray-900"
                >Order  #{orderDetails && orderDetails._id}</h1>

                <p className="text-base font-medium leading-6 text-gray-600">
                    {orderDetails &&
                        orderDetails.createdAt &&
                        orderDetails.createdAt.split("T")[0]}{" "} | {" "}
                    {orderDetails && orderDetails.createdAt &&
                        orderDetails.createdAt.split("T")[1].split(".")[0]}

                </p>
            </div>

            <div className="w-full flex flex-row mt-6">
                <div className=" flex flex-col justify-start items-start w-full xl:flex-row items-start xl:space-x-8 md:space-y-6">
                    <div className="flex flex-col justify-start  items-start bg-gray-50 px-4 my-4 md:p-6 xl:p-8 xl:p-8 w-full ">
                        <p className="font-bol text-lg"> Your order summary</p>
                        {
                            orderDetails && orderDetails.orderItems.length ? orderDetails.orderItems.map((item: any) => (
                                <div
                                    key={item._id}
                                    className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start  md:items-center md:space-x-6 xl:space-x-8 w-full"
                                >
                                    <div className="flex flex-row  pb-4 md:pb-8 w-full md:w-40">
                                        <Image
                                            alt="order item image"
                                            src={item.product && item.product.imageUrl ? item.product.imageUrl : "/placeholder-image.png"}
                                            width={200}
                                            height={200}
                                            className="w-full md:block"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="border-b border-gray-300 md:flex-row md:justify-between w-full flex flex-row  items-start  pb-4 space-y-4 md:space-y-0">
                                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                {item && item.product && item.product.name ? item.product.name : "Product Name"}
                                                
                                            </h3>
                                            
                                        </div>
                                        <div className="w-full flex flex-col items-start space-y-4 md:items-end">
                                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                                ${item && item.product && item.product.price ? item.product.price.toFixed(2) : "0.00"}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )) : null}
                    </div>
                    <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-5 xl:space-x-8">
                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
                            <h3 className="text-xl font-semibold leading-5 text-gray-900">
                                summary
                            </h3>
                            <div className="flex flex-col items-center justify-center  w-full space-y-4 border-gray-200 border-b pb-4">
                                <div className="flex justify-between w-full">
                                    <p className="text-base leading-5 text-gray-800">
                                        subtotal
                                    </p>
                                    <p className="text-base leading-5 text-gray-900">
                                        ${orderDetails && orderDetails.totalPrice ? orderDetails.totalPrice.toFixed(2) : "0.00"}
                                    </p>
                                </div>
                                <div className="flex justify-between w-full">
                                    <p className="text-base leading-5 text-gray-800">
                                        Shipping
                                    </p>
                                    <p className="text-base leading-5 text-gray-900">
                                        Free
                                    </p>
                                </div>
                                <div className="flex justify-between w-full">
                                    <p className="text-base leading-5 text-gray-800">
                                        Subtotal
                                    </p>
                                    <p className="text-base leading-5 text-gray-900">
                                        ${orderDetails && orderDetails.totalPrice ? orderDetails.totalPrice.toFixed(2) : "0.00"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 space-x-4 ml-6">
                    <div className="bg-gray-50 w-full xl:w-96 flex items-center md:items-start px-4 py-6 flex-col">
                        <h3 className="text-xl font-semibold leading-5 text-gray-900">
                            Customer Details
                        </h3>
                        <div className="">
                            <p className="text-base font-semibold leading-4 text-left text-gray-950 my-4">

                                Name:  <span className=" font-normal ml-2">
                                    {orderDetails?.shippingAddress?.fullName || "Navn ikke fundet"}
                                </span>

                            </p>
                            <p className="text-base  font-semibold leading-4 text-left text-gray-950">
                                Email:
                                <span className=" font-normal ml-2">
                                    {orderDetails?.user?.email || user?.email}
                                </span>
                            </p>
                        </div>

                    </div>
                    <div className="w-full flex justify-center items-center xl:h-full items-stretch w-full ">
                        <div className="mt-6 md:mt-0 felx justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 md:space-y-0 xl:space-y-12 md:flex-row md:items-start">
                            <div className="flex justify-center md:justify-start items-center md:items-start md:items-start flex-col space-y-4 space-y-4 xl:mt-8">
                                <p>
                                    shipping Address:
                                </p>
                                <p className="font-normal ml-2">
                                    Address: {" "}
                                    {orderDetails && orderDetails.shippingAddress.address}
                                </p>
                                <p>
                                    {orderDetails && orderDetails.shippingAddress.city}

                                </p>
                                <p>
                                    Country:{" "}
                                    {orderDetails && orderDetails.shippingAddress.country}

                                </p>
                                <p>
                                    Postal Code: {" "}
                                    {orderDetails && orderDetails.shippingAddress.postalCode}

                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className=" mt-5 mr-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide rounded-md hover:bg-gray-600 transition duration-100 "
                    >
                        Shop Again
                    </button>
                </div>
            </div>
        </div>
    )

}