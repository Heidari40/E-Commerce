'use client';

import { useState, useEffect } from "react";
import { getAllAdminProducts } from "@/src/services/auth/product/product";
import { useRouter } from "next/navigation";


export default function Home() {

  const [products, setProduct] = useState([]);
  const router = useRouter();

  console.log("Der er Productsssssssss", products);



  async function getListOfproducts() {
    const res = await getAllAdminProducts();
    console.log(res);
    if (res.success) {
      setProduct(res.data);
    } else {
      console.log(res.message);
    }
  }


  useEffect(() => {
    getListOfproducts();
  }, [])




  return (
    <main className=" flex min-h-screen flex-col items-center justify-between py-10">
      <section className="">
        <div className="grid max-w-screen-xl  gap-8 px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 xl:px-6">
          <div className="mr-auto place-self-center lg:col-span-7 ">
            <h1 className="max-w-2xl mb-4 tracking-tight font-extrabold text-gray-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl">
              Best Fashion Collection
            </h1>
            <p className="max-w-2xl mb-6 font-tight text-gray-500  md:text-lg">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni expedita et fugiat
              laudantium voluptates velit soluta natus, impedit dicta necessitatibus laboriosam, illo consequuntur illum nesciunt, odit enim sequi iure maiores?
            </p>
            <button
              className="mt-1-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white rounded-lg mb-4"
              onClick={() => router.push("/product/listing/all-products")}
            >
              Explore Shop Collection
            </button>
          </div>
          <div className="lg:mt lg:col-span-5 lg:flex rounded-lg overflow-hidden ">
            <img
              alt="Product Pic"
              src="https://media.craiyon.com/2025-10-19/U5R24jsrTLO3KaCPE4sIPA.webp"
              width={400}
            />
          </div>
        </div>
        <div className="max-w-screen-xl px-4 py-8 max-auto sm:py-12 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
            <div className="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
              <div className="max-w-md max-auto text-center lg:text-left">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                    Summer Sale Collection
                  </h2>
                </div>
                <button className="mt-1-5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white rounded-lg md-4"
                >
                  Shop All
                </button>
              </div>
            </div>
            <div className="lg:col-span-2 lg:py-8">
              <ul className="grid grid-cols-2 gap-4">
                {products && products.length
                  ? products
                    //  .filter((item: any) => item.onSale === "yes")
                    .splice(0, 2)
                    .map((productItem: any) => (
                      <li
                        key={productItem._id}
                        onClick={() => router.push(`/product/${productItem._id}`)}
                        className="cursor-pointer"
                      >
                        <div>

                          <img
                            src={productItem.imageUrl || "https://via.placeholder.com/150"}
                            alt="product item"
                            className="object-cover w-full rounded aspect-square"
                          />

                        </div>
                        <div className="mt-3">
                          <h3 className="font-medium tex-gray-900">
                            {productItem.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-800">
                            {productItem.price}{""}
                            <span className="text-red-700">{`(-$${productItem.priceDrop})`}</span>

                          </p>
                        </div>
                      </li>
                    )) : null}
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-950 sm:text-3xl">
              SHOP BY CATEGORY
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-3">
            <li>
              <div className="relative block group">
                <img src="https://b622708.smushcdn.com/622708/wp-content/uploads/2015/09/How-to-Help-Your-Kids-Find-their-Own-Fashion-Style-mini.jpg?lossy=2&strip=1&webp=1"

                  alt="" />

                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <h3 className="text-xl font-medium tracking-wide text-white "> KIDS</h3>
                  <button
                    onClick={() => router.push("/product/listing/kids")}
                    className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white  cursor-pointer rounded-lg">
                    Shop Now
                  </button>
                </div>
              </div>
            </li>

            <li>
              <div className="relative block group">
                <img src="https://www.uselesswardrobe.dk/wp-content/uploads/2024/06/IMG_2242-scaled.jpg"

                  alt="" />

                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <h3 className="text-xl font-medium tracking-wide text-white "> WOMEN</h3>
                  <button
                    onClick={() => router.push("/product/listing/women")}
                    className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white cursor-pointer rounded-lg">
                    Shop Now
                  </button>
                </div>
              </div>
            </li>

            <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div className="relative block group">
                <img src="https://media.gq.com/photos/570e6dbddb36a26c37acd918/master/w_1600%2Cc_limit/gq-chris-evans-captain-america-civil-war-premiere.jpg"
                  width={680}
                  alt="" />

                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <h3 className="text-xl font-medium tracking-wide text-white "> MEN</h3>
                  <button
                    onClick={() => router.push("/product/listing/men")}
                    className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white  cursor-pointer rounded-lg">
                    Shop Now
                  </button>
                </div>
              </div>
            </li>

          </ul>
        </div>
      </section>
    </main>

  );
}
