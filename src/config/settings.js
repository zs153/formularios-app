// imports
import dotenv from "dotenv";

// init
dotenv.config({ path: __dirname + '/./../../.env' })

// exports
export const puerto = process.env.PORT;
export const serverWEB = process.env.SERVER_WEB;
export const serverAPI = process.env.SERVER_API;
export const serverAUTH = process.env.SERVER_AUTH;
export const secretoKey = process.env.SECRETO_KEY
export const publicKey = process.env.PUBLIC_KEY