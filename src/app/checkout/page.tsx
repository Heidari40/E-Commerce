'use client'

import { useContext, useEffect, useState, Suspense } from "react"
import { GlobalContext } from "@/src/context"
import Image from "next/image"
import { fetchAlladdresses } from "@/src/services/auth/address/address"
import { useRouter, useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { callStripeSession } from "@/src/services/auth/stripe/stripe"
import { CreateNewOrder } from "@/src/services/auth/order/order"
import toast from "react-hot-toast"
import { PulseLoader } from "react-spinners"
import Cookies from "js-cookie"

// Initialize Stripe outside the component to prevent re-creation on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckOutContent() {
    const { cartItems, user, addresses, setAddresses, checkoutFormData, setCheckoutFormData } = useContext(GlobalContext)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const router = useRouter();
    const [isOrderProcessing, setIsOrderProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const params = useSearchParams();
    // fetch alle adresses
    async function getAllAddresses() {
        const res = await fetchAlladdresses(user?._id)
        if (res.success) {
            setAddresses(res.data)
        }
    }
    const token = Cookies.get("token");

    useEffect(() => {
        if (user !== null && user !== undefined && token) getAllAddresses()
    }, [user])

    //laver findel order.
    useEffect(() => {
        const token = Cookies.get("token"); // Hent token fra cookies i stedet for localStorage

        if(!user || !user._id || !token)return;
        async function createFinalOrder() {
            const isStripe = JSON.parse(localStorage.getItem("stripe") || "false"); // konverterer en tekststreng fra localStorage til et rigtigt JavaScript‑objekt eller en værdi.
            const status = params.get("status");

            if (isStripe && status === "success") {
                if (cartItems && cartItems.length > 0) {
                    setIsOrderProcessing(true);
                    const getCheckoutFormData = JSON.parse(localStorage.getItem("checkoutFormData") || "{}");

                    const creatFinalCkeckoutFormData = {
                        user: user._id,
                        cartItems,
                        shippingAddress: getCheckoutFormData.shippingAddress,
                        orderItems: cartItems.map((item: any) => ({
                            qty: 1,
                            product: item.productID._id,
                        })),
                        paymentMethod: "Stripe",
                        totalPrice: cartItems.reduce(
                            (total: any, item: any) => item.productID.price + total,
                            0
                        ),
                        isPaid: true,
                        isProcessing: true,
                        paidAt: new Date(),
                    };

                    const res = await CreateNewOrder(creatFinalCkeckoutFormData);
                    console.log(res, "Det er reeeeesss")

                    if (res.success) {
                        localStorage.setItem("stripe", "false");
                        localStorage.removeItem("checkoutFormData");
                        setIsOrderProcessing(false);
                        setOrderSuccess(true);
                        toast.success(res.message || "Order created successfully");
                        console.log(res.message, "ordren er oprettetttttt...")
                    } else {
                        setIsOrderProcessing(false);
                        setOrderSuccess(false);
                        toast.error(res.message || "Failed to create order");
                    }

                } else if (!orderSuccess && cartItems.length === 0) {
                    console.log("ingen varer i kurven - ordren er måske allerede oprettet")
                }
            }
        }

        createFinalOrder();
    }, [params, cartItems, user]) // Comprehensive dependency array


    function handleSelectedAddresses(getAddress: any) {
        if (getAddress._id === selectedAddress) {
            setSelectedAddress(null);
            setCheckoutFormData({
                ...checkoutFormData,
                shippingAddress: {},
            })
            return;
        }
        setSelectedAddress(getAddress._id);
        setCheckoutFormData({
            ...checkoutFormData
            , shippingAddress: {
                ...checkoutFormData.shippingAddress,
                fullName: getAddress.fullName,
                address: getAddress.address,
                city: getAddress.city,
                country: getAddress.country,
                postalCode: getAddress.postalCode,
            }
        });
    }

    async function handleCheckout() {
        const stripe = await stripePromise;

        if (!stripe) {
            console.log("Stripe not loaded")
            return;
        }

        const createLineItems = cartItems.map((item: any) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    images: [item.productID?.imageUrl],
                    name: item.productID?.name,
                },
                unit_amount: (item.productID?.price) * 100,
            },
            quantity: 1,
        }));


        const res = await callStripeSession(createLineItems);
        console.log("Stripe session response:", res);
        setIsOrderProcessing(true);
        localStorage.setItem("stripe", JSON.stringify(true));
        localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));



        //  window.location.href = res?.data?.url; => den er også korrekt

        if (res.success && res.data?.url) {
            setIsOrderProcessing(false);
            window.location.href = res.data.url;
        } else {
            setIsOrderProcessing(false);
            toast.error(res.message || "Something went wrong444.")
        }

    }

    useEffect(() => {
        if (orderSuccess) {
            const timer = setTimeout(() => {
                router.push("orders");
            }, 4000);

            return () =>
                clearTimeout(timer);
        }
    }, [orderSuccess]);


    if (orderSuccess) {
        return (
            <section className="w-full h-screen bg-gray-200 ">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-10 ">
                    <div className="mx-auto mt-8  max-w-screen-xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow rounded-lg p-6 sm:p-8 lg:p-10 ">
                            <div className="w-full flex flex-col gap-5 x-4 py-6 sm:px-8 sm:py flex felx-col gap-5 justify-center">
                                <h1 className="font-bold text-lg item-center justify-center flex">
                                    Your payment is successfull, thank you for your order! You will be redirected to your orders page shortly.
                                </h1>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }



    if (isOrderProcessing) {
        return (
            <div>
                <PulseLoader
                    color={"#000000"}
                    loading={isOrderProcessing}
                    size={30}
                    data-testid="loader"
                />
            </div>
        );

    }

    return (

        <div className=" w-full h-full pt-10">
            <div className=" grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 2xl:px-40 ">
                <div className="px-4 py-8 ">
                    <p className="font-medium text-xl">
                        Cart Summery
                    </p>
                    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
                        {
                            cartItems && cartItems.length ? (
                                cartItems.map((item: any) => (
                                    <div
                                        className="flex flex-col  py-4 px-4 rounded-lg bg-white sm:flex-row"
                                        key={item._id}>
                                        <Image
                                            src={item.productID?.imageUrl || "/placeholder-image.png"}
                                            width={100}
                                            height={100}
                                            alt="cart items"
                                            className="w-[100px] h-[100px] object-cover object-center"
                                        />

                                        <div className="flex w-full flex-col px-4 py-4">
                                            <span className="font-bold">
                                                {item && item?.productID && item.productID.name}
                                            </span>

                                            <span className="font-semibold">
                                                {item && item?.productID && item.productID.price}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (

                                <div>
                                    <p className="font-medium text-xl items-center justify-center">
                                        Your cart is empty
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <p className="font-medium text-xl"> Shipping address details </p>
                    <p className="text-gray-400 font-bold">
                        Comlete you order by selcting address below
                    </p>
                    <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6">
                        {
                            addresses && addresses.length ? (
                                addresses.map((item: any) => (
                                    <div
                                        onClick={() => handleSelectedAddresses(item)}
                                        className={`border border-gray-300 rounded-lg p-6 ${item._id === selectedAddress ? "border-red-600" : ""}`
                                        }
                                        key={item._id}
                                    >
                                        <p>Nam: {item.fullName}</p>
                                        <p>Address: {item.address}</p>
                                        <p>City: {item.city}</p>
                                        <p>State: {item.country}</p>
                                        <p>Country: {item.country}</p>
                                        <p>PostalCode: {item.postalCode}</p>

                                        <button className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">
                                            {item._id === selectedAddress
                                                ? "Selected Address"
                                                : "Select Address"}
                                        </button>
                                    </div>
                                ))

                            ) : (
                                <p>No addresses found</p>
                            )}
                    </div>
                    <button
                        onClick={() => router.push("/account")}
                        className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                    >
                        Add new address
                    </button>
                    <div className="flex item-center justify-between pt-6">
                        <p className="text-sm font-medium text-gray-900">
                            Subtotal
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                            $
                            {cartItems && cartItems.length
                                ? cartItems.reduce(
                                    (total: any, item: any) => item.productID.price + total,
                                    0
                                ) : "0"
                            }
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Shipping</p>
                        <p className="text-medium font-bold text-gray-900">Free</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">Total</p>
                        <p className="text-lg font-bold text-gray-900">
                            ${
                                cartItems && cartItems.length
                                    ? cartItems.reduce(
                                        (total: any, item: any) => item.productID.price + total,
                                        0
                                    )
                                    : "0"
                            }
                        </p>
                    </div>

                    <div className="pb-10">
                        <button
                            onClick={handleCheckout}
                            disabled={
                                (cartItems && cartItems.length === 0) ||
                                !checkoutFormData.shippingAddress.fullName}

                            className="disabled:opacity-50 mt-5 w-full inline-block bg-black text-white px-5 py-3 text-sm font-medium uppercase tracking-wide"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CheckOut() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen flex items-center justify-center">
                <PulseLoader
                    color={"#000000"}
                    size={30}
                />
            </div>
        }>
            <CheckOutContent />
        </Suspense>
    )
}