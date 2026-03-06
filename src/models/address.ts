import { string } from "joi";
import mongoose from "mongoose";



const NewAddressSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullName: String,
    address: String,
    city: String,
    country: String,
    postalCode: string,
},
  {timestamps: true}
);

const Address = mongoose.models.Address || mongoose.model("Address", NewAddressSchema)


export default Address;