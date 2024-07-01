import dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/./../../.env' })

export const puerto = process.env.PORT
export const dbPool = {
  user: process.env.NODE_ORACLEDB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
  poolMin: 4,
  poolMax: 4,
  poolIncrement: 0,
  // poolPingTimeout: 5000,
  // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
  // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
  // queueTimeout: 2000, // terminate getConnection() calls queued for longer than 2000 milliseconds
}
export const maxRows = 50000
export const batchSize = 1000