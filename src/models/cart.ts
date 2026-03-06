import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema(
    {
        userID:
        {
            type: mongoose.Schema.Types.ObjectId, //Det bruges til at lave relationer mellem collections — lidt som “foreign keys” i SQL.
            ref: "User",
            required: true,
        },
        productID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity:{
            type: Number,
            required: true,
            default: 1,
        }
    },
    {timestamps: true}

);

const Cart = mongoose.models.Cart || mongoose.model("Cart", ProductSchema);

export default Cart;