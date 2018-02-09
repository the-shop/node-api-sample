import dotenv from "dotenv";

dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  db: process.env.MONGODB_URI || "mongodb://localhost/node-api-sample-api",
  debug: process.env.DEBUG === "true" || process.env.DEBUG === true,
  rootDir: `${__dirname}/..`,
  facebook: {
    appId: process.env.FACEBOOK_CLIENT_ID,
    appSecret: process.env.FACEBOOK_CLIENT_SECRET,
  },
  session: {
    secret: process.env.SESSION_SECRET || "shhhhh",
  },
  password: {
    resetTokenTimeoutSeconds: process.env.PASSWORD_RESET_TOKEN_TIMEOUT_SECONDS || 86400,
    requireCurrentOnChange: process.env.PASSWORD_REQUIRE_CURRENT_ON_CHANGE || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "shhhhh",
  },
  api: {
    host: process.env.API_HOST || "http://localhost:3030",
    port: process.env.PORT || 3030
  },
  frontend: {
    host: process.env.FRONTEND_HOST || "http://localhost:3000",
    passwordResetUri: process.env.FRONTEND_PASSWORD_RESET_URI || "/reset-password",
  },
  admin: {
    host: process.env.ADMIN_HOST || "http://localhost:3000",
    uri: process.env.ADMIN_ROUTE_URI || "/admin",
    passwordResetUri: process.env.ADMIN_PASSWORD_RESET_URI || "/reset-password",
  },
  swagger: {
    host: process.env.SWAGGER_HOST || "http://localhost:3030"
  },
  contact: {
    name: process.env.GENERAL_CONTACT_NAME || "Company",
    email: process.env.GENERAL_CONTACT_EMAIL_ADDRESS || "contact@company.com"
  },
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    lists: {
      allUsers: process.env.MAILCHIMP_ALL_USERS_LIST_NAME || "All Users",
    },
    contact: {
      company: process.env.MAILCHIMP_COMPANY_NAME || "Company",
      address1: process.env.MAILCHIMP_COMPANY_ADDRESS1 || "Our address",
      address2: process.env.MAILCHIMP_COMPANY_ADDRESS2,
      city: process.env.MAILCHIMP_COMPANY_CITY || "New York",
      state: process.env.MAILCHIMP_COMPANY_STATE || "New York",
      zip: process.env.MAILCHIMP_COMPANY_ZIP || "44444",
      country: process.env.MAILCHIMP_COMPANY_COUNTRY || "United States",
      phone: process.env.MAILCHIMP_COMPANY_PHONE,
    },
    campaignDefaults: {
      fromName: process.env.MAILCHIMP_CAMPAIGN_FROM_NAME
      || process.env.GENERAL_CONTACT_NAME
      || "Name",
      fromEmail: process.env.MAILCHIMP_CAMPAIGN_FROM_EMAIL
      ||  process.env.GENERAL_EMAIL_CONTACT_ADDRESS
      || "contact@company.com",
      subject: process.env.MAILCHIMP_CAMPAIGN_SUBJECT || "Campaign subject",
      language: process.env.MAILCHIMP_CAMPAIGN_LANGUAGE || "en-US",
    }
  },
  mailgun: {
    apikey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
  amazon: {
    s3: {
      key: process.env.AMAZON_KEY,
      secret: process.env.AMAZON_SECRET,
      uploadsBucketName: process.env.AMAZON_UPLOAD_BUCKET_NAME,
      uploadsBucketRegion: process.env.AMAZON_UPLOAD_BUCKET_REGION,
      url: process.env.AMAZON_S3_URL || "https://s3.amazonaws.com/",
    }
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  web: {
    uploadsDirectory: "uploads/"
  },
  listenerPaths: {
    staticPath: "/src/Listeners",
    servicesPath: "/src/Services"
  },
  application: {
    ownerId: process.env.OWNER_ID || "aaaaaaaaaaaaaaaaaaaaaaaa"
  }
};

export default config;
