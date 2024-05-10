import dotenv from "dotenv";

dotenv.config({ path: __dirname + '/./../../.env' })

export const publicKey = process.env.PUBLIC_KEY
export const puertoAPI = process.env.PORT_API;
export const serverAPI = process.env.SERVER_API;
export const puertoWEB = process.env.PORT_WEB;
export const serverWEB = process.env.SERVER_WEB;
export const puertoAUTH = process.env.PORT_AUTH;
export const serverAUTH = process.env.SERVER_AUTH;
export const secreto = process.env.SECRETO_KEY