"use client";

import ProductTile from "./ProductTile";
import ProductButtons from "./ProductButtons";
import { useEffect } from "react";
import { useRouter } from "next/navigation";




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
    createdAt: string;
    updatedAt: string;
}




export default function CommonListing({ data }: { data: ProductType[] }) {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [])

    return (

        <section className=" bg-white py-12 sm:py-16 ">
            <div className="mx-auto  max-w-screen-xl px-2 sm:px-6 lg:px-8  ">
                <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 ">
                    {data && data.length ?
                        data.map((item: any) => (
                            <article
                                className="relative flex flex-col overflow-hidden border border-gray-100 cursor-pointer"
                                key={item._id}
                            >
                                <ProductTile item={item} />
                                <ProductButtons item={item} />
                               
                            </article>
                        ))
                        : null}
                </div>
            </div>
        </section>
    );
}