
import jwt, {JwtPayload}from "jsonwebtoken";

interface MyTokenPayload extends JwtPayload {
  role: string;
  userID: string;
}


export const dynamic = "force-dynamic";


const AuthUser = async (req: Request): Promise<MyTokenPayload | null> => {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return null;

    const extractAuthUserInfo = jwt.verify(token, "default_secret_key") as MyTokenPayload;
    if (extractAuthUserInfo){
      return extractAuthUserInfo;
    }else{
      return null;
    }

  } catch (error) {
    console.log(error);
    return null;
  }

}

export default AuthUser;