import CommonListing from "@/src/components/CommonListing";
import { ProductByCategory } from "@/src/services/auth/product/product";



export default async function Men(){

    const getAllProducts = await ProductByCategory("men");

    return (
        <CommonListing
            data = {getAllProducts && getAllProducts.data}
        />
    )

}