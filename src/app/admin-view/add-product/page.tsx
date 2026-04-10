'use client'

import InputComponent from "@/src/components/CommonModel/FormElements/InputComponent";
import TileComponent from "@/src/components/CommonModel/FormElements/TileComponent"
import { adminAddProductformControls, AvailableSizes } from "@/src/utils"
import { useState, useContext, useEffect } from "react";
import SelectComponent from "@/src/components/CommonModel/FormElements/SelectComponent";
import { toast } from "react-hot-toast";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addNewProduct, updateProduct } from "@/src/services/auth/product/product";
import { GlobalContext } from "@/src/context";
import { useRouter } from "next/navigation";
import ComponentLevelLoader from "@/src/components/Loader/componentlevel";

type FirebaseConfigPropstypes = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}


type SizeOption = {
    id: string;
    label: string;
}

type ProductForm = {
  
    name: string;
    price: number;
    description: string;
    category: string;
    sizes: SizeOption[];
    deliveryInfo: string;
    onSale: string;
    imageUrl: string;
    priceDrop: number;
}

const firebaseConfig: FirebaseConfigPropstypes = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,

}

const initialFormData: ProductForm = {
   
    name: "",
    price: 0,
    description: "",
    category: "men",
    sizes: [],
    deliveryInfo: "",
    onSale: "no",
    imageUrl: "",
    priceDrop: 0,
}

type FormFieldKey = "name" | "price" | "description" | "category" | "sizes" | "deliveryInfo" | "onSale" | "imageUrl" | "priceDrop";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)

const createUniqueFileName = (getFile: File) => {
    const timeStamp = Date.now(); //giver dig det aktuelle tidspunkt i millisekunder siden 1. januar 1970
    const randomStringValue = Math.random().toString(36).substring(2, 15); //Denne linje laver en tilfældig streng.

    return `$${getFile.name}-${timeStamp}-${randomStringValue}`;
}

async function helperForUploadingImageToFirebase(file: File): Promise<string> {
    const getFileName = createUniqueFileName(file);
    const storageReference = ref(storage, `E-webshop/${getFileName}`);
    const uploadImage = uploadBytesResumable(storageReference, file);


    return new Promise((resolve, reject) => {
        uploadImage.on(
            "state_changed",
            (snapshot) => { }, // 1. Argument: Snapshot (progress) - skal være her!
            (error) => {       // 2. Argument: Error
                console.log(error);
                reject(error);
            },
            () => {            // 3. Argument: Complete
                getDownloadURL(uploadImage.snapshot.ref)
                    .then((downloadURL) => resolve(downloadURL))
                    .catch((error) => reject(error));
            })
    });
}

export default function AddProduct() {
    const [formData, setFormData] = useState<ProductForm>(initialFormData);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const { componentLevelLoader, setComponentLevelLoader,currentUpdatedProduct ,setCurrentUpdatedProduct } = useContext(GlobalContext);
    const router = useRouter();


    const handleImageSize = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Tjek filstørrelse FØR upload
        if (file.size > 2000000) {
            toast.error("File is too large(max 2MB)", {
                duration: 4000,
            });

            return ;
        }

        try {
            setIsImageUploading(true);
            toast.loading("Uploading image...", { id: "uploading" });

            // 3. Upload til Firebase
            const extractImageUrl = await helperForUploadingImageToFirebase(file);
            
            if (typeof extractImageUrl === "string" && extractImageUrl !== "") {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    imageUrl: extractImageUrl,
                }));
                toast.success("Image uploaded successfully", { id: "uploading" });
            }
        } catch (error) {
            toast.error("Error uploading image", { id: "uploading" });
        } finally {
            setIsImageUploading(false);
        }

    }

    function handleTileClick(getCurrentItem: any) {
        let cpySizes = [...formData.sizes];  // ... betyder:“Tag alle elementerne i arrayet og læg dem ind i et nyt array.”
        const index = cpySizes.findIndex(item => item.id === getCurrentItem.id);
        if (index === -1) {
            cpySizes.push(getCurrentItem);
        } else {
            cpySizes = cpySizes.filter((item) => item.id !== getCurrentItem.id)
        }
        //“Behold alt det gamle formData, men opdater sizes med den nye liste.”
        setFormData({
            ...formData,
            sizes: cpySizes,
        })
    }

    async function handelAddProduckt() {

        setComponentLevelLoader({ loading: true, id: "" });

        const res = currentUpdatedProduct !== null
        ? await updateProduct(formData)
        : await addNewProduct(formData);

        console.log(res);

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message);
            setFormData(initialFormData);
            // setCurrentUpdatedProduct(null);
            setTimeout(() => {
                router.push("/admin-view/all-products");
            }, 1000);
        } else {
            toast.error(res.message);
            setComponentLevelLoader({ loading: false, id: "" });
        }
    }
    console.log(formData);
    useEffect(() => {
       if (currentUpdatedProduct !== null) setFormData(currentUpdatedProduct);
    }, [currentUpdatedProduct])

    return (
        <div className="w-full mx-auto my-5 px-5 py-5 relative">
            <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
                <div className="w-full mx-auto my-5 py-5 px-5 relative space-y-8 ">
                    <form>

                        <label className="pr-2">Select a picture:</label>
                        <input
                            id="fileUpload"
                            name="fileUpload"
                            accept="image/*"
                            max="1000000"
                            type="file"
                            onChange={handleImageSize}
                            className="border p-2 rounded-md cursor-pointer bg-gray-100"
                        />
                    </form>

                    <div className="flex gap-4 flex-col">
                        <label>Available sizes</label>
                        <TileComponent
                            selected={formData.sizes}
                            data={AvailableSizes}
                            onClick={handleTileClick}

                        />
                    </div>

                    {adminAddProductformControls.map((controlItem) =>
                        controlItem.componentType === "input" ? (
                            <InputComponent
                                type={controlItem.type}
                                placeholder={controlItem.placeholder}
                                label={controlItem.label}
                                key={controlItem.id}
                                value={String(formData[controlItem.id as FormFieldKey])}
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        [controlItem.id]:
                                            controlItem.type === "number"
                                                ? Number(event.target.value)
                                                : event.target.value,
                                    });
                                }}
                            />

                        ) : controlItem.componentType === "select" ? (
                            <SelectComponent
                                options={controlItem.options || []}
                                label={controlItem.label}
                                key={controlItem.id}
                                value={String(formData[controlItem.id as FormFieldKey])}
                                onChange={(event) => {
                                    setFormData({ ...formData, [controlItem.id]: event.target.value });
                                }}
                            />
                        ) : null
                    )}

                    <button
                        disabled={isImageUploading || (formData.imageUrl === "" && currentUpdatedProduct === null)}
                        onClick={handelAddProduckt}
                        className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-9 py-3 pb-2 cursor-pointer rounded-md text-lg text-white font-medium uppercase tracking-wide">


                        {componentLevelLoader && componentLevelLoader.loading ? (
                            <ComponentLevelLoader
                                text={currentUpdatedProduct !== null ? "Updating Product" : "Adding Product"}
                                color={"#ffff"}
                                loading={componentLevelLoader && componentLevelLoader.loading}
                                size={10}
                            />
                        ) : isImageUploading ? (
                            "Uploading image..."
                        ) : currentUpdatedProduct !== null ? (
                            "Update Product"
                        ) : (
                            "Add Product"
                            )}
                    </button>
                </div>
            </div>
        </div>
    )
}