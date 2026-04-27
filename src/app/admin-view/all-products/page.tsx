import CommonListing from "@/src/components/CommonListing";
import { getAllAdminProducts } from "@/src/services/auth/product/product";

// Dette tvinger Next.js til at behandle ruten som dynamisk (Server-Side Rendering)
export const dynamic = 'force-dynamic';
// Vi sikrer os også at fetch-cachen ikke gemmer resultater statisk
export const revalidate = 0;

export default async function AllProducts() {
    const getAllProducts = await getAllAdminProducts();

    return (
        <CommonListing
            data={getAllProducts?.data || []}
        />
    );
}