import jwt from "jsonwebtoken";
import { config } from "dotenv";
import _ from "lodash";
import { ACCESS_TOKEN_TTL } from "./constants.js";

config();

const privateKey = process.env.PRIVATE_KEY as string;
const publicKey = process.env.PUBLIC_KEY as string;

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: "RS256"
    })
}
const compareDates = (iat: number, exp: number, ttl: number) => {
    console.log({iat, ttl, total: iat + ttl});
    iat = new Date(iat + ttl).getTime();
    exp = new Date(exp).getTime();
  
    return exp >= iat;
}

export function verifyJwt(token: string, type: string) {
    console.log("Type: ", type);

    try {
        const decoded = jwt.verify(token, publicKey);
        console.log("Decoded: ", decoded)
        
        const iat = _.get(decoded, "iat");
        const exp = _.get(decoded, "exp");

        console.log("Is expired: ", compareDates(iat, exp, 900000));
        
        return {
            valid: true,
            expired: compareDates(iat, exp, 900000),
            decoded,
        }
    } catch (error: any) {
        console.error(error.message);
        return {
            valid: false,
            expired: error.message === "jwt must be provided",
            decoded: null 
        }
    }
}