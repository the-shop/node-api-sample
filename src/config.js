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
    port: process.env.PORT || 3030,
    corsWhitelistOrigins: process.env.API_CORS_WHITELIST_ORIGINS || "",
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
    host: process.env.SWAGGER_HOST || "http://localhost:3030",
    docsUri: process.env.API_DOCS_URI || "/api-docs/",
  },
  contact: {
    name: process.env.GENERAL_CONTACT_NAME || "Company",
    email: process.env.GENERAL_CONTACT_EMAIL_ADDRESS || "contact@company.com",
    paymentDisputesEmail: process.env.PAYMENT_DISPUTES_CONTACT_EMAIL_ADDRESS || "contact@company.com",
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
  web: {
    uploadsDirectory: "uploads/",
  },
  listenerPaths: {
    staticPath: "/src/Listeners",
    servicesPath: "/src/Services",
  },
  application: {
    ownerId: process.env.OWNER_ID || "aaaaaaaaaaaaaaaaaaaaaaaa",
    serviceAccountEmail: process.env.API_SERVICE_ACCOUNT_EMAIL || "email@service-account.com",
  }
};

export default config;
