"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";


export default function ProductTile({ item }: { item: any }) {
    const router = useRouter();
    
    return (
        <div
          onClick={() => router.push(`/product/${item._id}`)}
          className="mx-16"
        >
            <div
                className="w-full h-full object-cover cursor-pointer transition-all duration-300 group-hover:scale-110"
            >
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-125 "
                />
            </div>
            {item.onSale === "yes" ? (
                <div className="absolute top-0 m-2 rounded-full bg-black">
                    <p className=" px-3 py-1 rounded-full p-1 text-[8px] font-bold uppercase tracking-wide text-white sm:py-1 sm:px-3">
                        Sale 
                    </p>  
                </div>
            ) : null}
            <div className=" justify-center flex flex-col ">
                <h3 className="mb-2 px-4 text-gray-400 text-sm">{item.name}</h3>
               

                <div className="mb-2 flex flex-row items-start ">

                     <p className={`mr-3 text-sm px-4  font-semibold ${item.onSale === "yes" ? "line-through" : ""}`}>
                        {`$ ${item.price}`}
                    </p>
                    
                    {item.onSale === "yes" ?
                        <p className=" text-sm px-4 font-semibold">
                            {`-(${item.priceDrop}%) off`}
                        </p>        
                     : null}
                    {item.onSale === "yes" ? (
                        <p className="text-red-600 mr-3 text-sm px-4 font-semibold ">
                            {`$ ${(item.price - (item.price * item.priceDrop / 100)).toFixed(2)}`}
                        </p>
                    ) : null}
                    

                </div>
                

            </div>

        </div>
    )
}