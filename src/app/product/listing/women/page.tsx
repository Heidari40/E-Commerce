import CommonListing from "@/src/components/CommonListing";
import { ProductByCategory } from "@/src/services/auth/product/product";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Women(){
    const getAllProducts = await ProductByCategory("women");

    return (
        <CommonListing
            data={getAllProducts?.data || []}
        />
    )
}