import CommonListing from "@/src/components/CommonListing";
import { ProductByCategory } from "@/src/services/auth/product/product";

export const dynamic = 'force-dynamic';

export default async function Women(){
    const getAllProducts = await ProductByCategory("women");

    return (
        <CommonListing
            data = {getAllProducts && getAllProducts.data}
        />
    )


}