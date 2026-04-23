'use client'

import { use, useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/src/context";
import { useRouter, useSearchParams } from "next/navigation";
import ComponentLevelLoader from "@/src/components/Loader/componentlevel";
import { PulseLoader } from "react-spinners";
import { addNewAddressFormControls } from "@/src/utils";
import InputComponent from "@/src/components/CommonModel/FormElements/InputComponent";
import { addNewAddress, updateAddress, fetchAlladdresses, deleteAddress } from "@/src/services/auth/address/address";
import toast from "react-hot-toast";


export default function Account() {
    const { user,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        componentLevelLoader,
        setComponentLevelLoader,
        pageLevelLoader,
        setPageLevelLoader
    } = useContext(GlobalContext);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [currentEditedAddressId, setCurrentEditedAddressId] = useState<string | null>(null);

    //useSearchParams() er måden at arbejde med query‑parametre i React Router — både læse og skrive dem — uden at reloade siden.
    const params = useSearchParams();
    const router = useRouter();


    //extract alle data 
    async function extractAllAddresses() {
        setPageLevelLoader(true);
        const res = await fetchAlladdresses(user._id);

        if (res.success) {
            setAddresses(res.data);
            setPageLevelLoader(false);
        } else {
            toast.error(res.message);
            setPageLevelLoader(false);
        }
    }

    //Fordi API-kald ikke må ske i render-funktionen og burger useEffect.
    useEffect(() => {
        if (user !== null) extractAllAddresses()
    }, [user]);


    async function handleAddOrUpdateAddress() {
        const isUpdating = currentEditedAddressId !== null;
        setComponentLevelLoader({ loading: true, id: "" });
        const res = isUpdating
            ? await updateAddress({
                ...addressFormData, userID: user?._id,
                _id: currentEditedAddressId,
            })
            : await addNewAddress({ ...addressFormData, userID: user?._id });

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message);
            setAddressFormData({
                fullName: "",
                address: "",
                city: "",
                country: "",
                postalCode: "",
            });
            extractAllAddresses();
            setCurrentEditedAddressId(null);
        } else {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.error(res.message);
            // Behold formulardata, så brugeren kan rette dem
        }
    }

    // Update addresse
    function handleUpdateAddress(getCurrentAddress: any) {
        if (!getCurrentAddress || !getCurrentAddress._id) {
            console.error("Missing _id in address: ", getCurrentAddress);
            return;

        }
        console.log(getCurrentAddress);
        setShowAddressForm(true);
        setAddressFormData({
            fullName: getCurrentAddress.fullName,
            address: getCurrentAddress.address,
            city: getCurrentAddress.city,
            country: getCurrentAddress.country,
            postalCode: getCurrentAddress.postalCode,
        });
        setCurrentEditedAddressId(getCurrentAddress._id ?? null);
    }



    async function handleDelete(getCurrentAddressID: any) {
        setComponentLevelLoader({ loading: true, id: getCurrentAddressID });
        const res = await deleteAddress(getCurrentAddressID)

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message);
            extractAllAddresses();

        } else {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.error(res.message);
        }
    }


    return (
        <section>
            <div className="w-full h-full mx-auto  items-center justify-center bg-gray-200 px-4 sm:px-6 lg:px-8 ">
                <div className="bg-white shadow">
                    <div className="p-6 sm:p-12">
                        <div className=" flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
                            <p>Vi opload image her</p>

                        </div>
                        <div className="felx flex-col ">
                            <h4 className="text-lg font-semibold text-center md-text-left">
                                {user?.name}
                            </h4>
                            <p>{user?.email}</p>
                            <p>{user?.role}</p>
                        </div>
                        <button
                            onClick={() => router.push("/orders")}
                            className="inline-flex w-full items-center justify-center bg-black px-9 py-3 pb-2 cursor-pointer rounded-md text-lg text-white font-medium uppercase">
                            View Your Orders
                        </button>

                        <div className="mt-6 ">
                            <h1 className="font-bold">Your Addresses:</h1>
                            {
                                pageLevelLoader ? (
                                    <PulseLoader
                                        color={"#000000"}
                                        loading={pageLevelLoader}
                                        size={15}
                                        data-testid="loader"
                                    />
                                ) : (

                                    <div>
                                        {
                                            addresses && addresses.length ? (
                                                addresses.map((item: any) => (

                                                    <div className="border p-6" key={item._id}>

                                                        <p>Name: {item.fullName}</p>
                                                        <p>Address: {item.address}</p>
                                                        <p>City: {item.city}</p>
                                                        <p>Country: {item.country}</p>
                                                        <p>Postal Code: {item.postalCode}</p>
                                                        <button
                                                            onClick={() => handleUpdateAddress(item)}
                                                            className="mt-5 mr-5 inline-block bg-black text-white  px-5 py-3 font-medium uppercase tracking-wide cursor-pointer">
                                                            Update
                                                        </button>
                                                        <button
                                                            className="mt-5 mr-5 inline-block bg-black text-white  px-5 py-3 font-medium uppercase tracking-wide cursor-pointer"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            {componentLevelLoader &&
                                                                componentLevelLoader.loading &&
                                                                componentLevelLoader.id === item._id ? (
                                                                <ComponentLevelLoader
                                                                    text={"Deleting"}
                                                                    color={"#746008"}
                                                                    loading={componentLevelLoader && componentLevelLoader.loading}
                                                                    size={8}
                                                                />
                                                            ) : (
                                                                "Delete"
                                                            )}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>
                                                    No addresses found! Please add a new address below
                                                </p>
                                            )}
                                    </div>

                                )}
                        </div>
                        <div className="mt-4">

                            <button
                                onClick={() => setShowAddressForm(!showAddressForm)}
                                className="mt-5 inline-block bg-black text-white px-5 text-xs font-medium uppercase tracking-wide">
                                {showAddressForm ? "Hide Address Form" : "Add New Address"}
                            </button>
                        </div>
                        {
                            showAddressForm && addressFormData && (
                                <div className="flex flex-col mt-5 justify-center pt-4 items-center">
                                    <div className="w-full mt-6 mr-0 mb-0 space-y-8">
                                        {addNewAddressFormControls.map((controlItem) => (
                                            <InputComponent
                                                key={controlItem?.id}
                                                type={controlItem.type}
                                                placeholder={controlItem.placeholder}
                                                label={controlItem.label}
                                                value={addressFormData[controlItem.id] ?? ""}
                                                onChange={(event) => {
                                                    setAddressFormData({
                                                        ...addressFormData,
                                                        [controlItem.id]: event.target.value,
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleAddOrUpdateAddress}
                                        className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide cursor-pointer"
                                    >

                                        {
                                            componentLevelLoader &&
                                                componentLevelLoader.loading ? (
                                                <ComponentLevelLoader
                                                    text={"Saving"}
                                                    color={"#ffff"}
                                                    loading={componentLevelLoader && componentLevelLoader.loading}
                                                    size={10}
                                                />
                                            ) : (
                                                "Save"
                                            )}
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </section>

    )
}