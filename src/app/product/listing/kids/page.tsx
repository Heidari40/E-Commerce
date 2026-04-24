import CommonListing from "@/src/components/CommonListing";
import { ProductByCategory } from "@/src/services/auth/product/product";

export const dynamic = 'force-dynamic';

export default async function Kids() {
    const getAllProducts = await ProductByCategory("kids");

    return (

        <CommonListing
            data={getAllProducts && getAllProducts.data}

        />




    )
}