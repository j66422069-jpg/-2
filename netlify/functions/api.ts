import serverless from "serverless-http";
import { createExpressApp } from "../../server";

let cachedHandler: any;

export const handler = async (event: any, context: any) => {
  try {
    if (!cachedHandler) {
      const app = await createExpressApp();
      cachedHandler = serverless(app);
    }
    return await cachedHandler(event, context);
  } catch (err: any) {
    console.error("Netlify Function Error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: "Internal Server Error", 
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
      }),
    };
  }
};
