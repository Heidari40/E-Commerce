import CommonListing from "@/src/components/CommonListing";
import { getAllAdminProducts } from "@/src/services/auth/product/product";



export default async function AllProducts() {

const getAllProducts = await getAllAdminProducts();

    return(

        <CommonListing
        data={getAllProducts && getAllProducts.data}
        />
    )
}