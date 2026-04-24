import CommonDetails from "@/src/components/CommonDetails";
import { ProductById } from "@/src/services/auth/product/product";

export const dynamic = 'force-dynamic';

export default async function ProductDetails({ params }: {params: Promise<{ details: string }>}) {
  const resolvedParams = await params;
  const productDetailsData = await ProductById(resolvedParams.details);
 

  return (
    <CommonDetails
      item={productDetailsData && productDetailsData?.data}
    />
  );
}
