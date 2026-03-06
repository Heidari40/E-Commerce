import mongoose from "mongoose";


type SizeOption = {
    id: string;
    label: string;
}
interface ProductType extends mongoose.Document{
    name: string;
    price: number;
    description: string;
    category: string;
    deliveryInfo: string;
    onSale: string;
    priceDrop: number;
    sizes: SizeOption[];
    imageUrl: string;
}


const ProductSchema = new mongoose.Schema<ProductType>({  //Et schema beskriver hvordan et produkt skal se ud i databasen
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  deliveryInfo: {
    type: String,
    required: true,
  },
  onSale: {
    type: String,
    required: true,
  },
  priceDrop: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  sizes: [
    {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    }
  ]

},
 {timestamps: true}  //Det betyder, at Mongoose automatisk tilføjer: createdAt / updatedAt
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;