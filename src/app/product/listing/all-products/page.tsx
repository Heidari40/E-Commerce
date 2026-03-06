import CommonListing from "@/src/components/CommonListing";
import { getAllAdminProducts } from "@/src/services/auth/product/product";


export default async function AllProducts() {
    const allAdminProducts = await getAllAdminProducts();
    return(
        <CommonListing 
         data={allAdminProducts && allAdminProducts.data}
        />
    )
}