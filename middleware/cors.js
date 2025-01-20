import cors from 'cors'
import { ACCEPTED_ORIGINS } from '../constants.js'

export const corsMiddleware = ({
  acceptedOrigins = process.env.UI_URL ? process.env.UI_URL : ACCEPTED_ORIGINS,
} = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin ? origin : '')) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
