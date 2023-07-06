export interface Secrets {
  DB_URL: string
  JWT_SECRET: string
  IS_PLAYGROUND_ENABLED: boolean
  IS_INTROSPECTION_ENABLED: boolean
  SENDGRID_API_KEY: string
  EMAIL_SENDER: string
  SMS_SENDER: string
  SMS_URL: string
  SMS_AUTH_HEADER: string
}

const secrets: Secrets = {
  DB_URL: process.env.DB_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  IS_PLAYGROUND_ENABLED: process.env.IS_PLAYGROUND_ENABLED === 'true',
  IS_INTROSPECTION_ENABLED: process.env.IS_INTROSPECTION_ENABLED === 'true',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY as string,
  EMAIL_SENDER: process.env.EMAIL_SENDER as string,
  SMS_SENDER: process.env.SMS_SENDER as string,
  SMS_URL: process.env.SMS_URL as string,
  SMS_AUTH_HEADER: process.env.SMS_AUTH_HEADER as string,
}

export default secrets
