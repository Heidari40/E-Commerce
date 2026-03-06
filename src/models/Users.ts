import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
});

//Hvis modellen User allerede findes i Mongoose’s cache, så brug den.
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;