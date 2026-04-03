// Already initialized Functions
import { ExecutionMethod } from "react-native-appwrite";
import { appwriteFunc } from "./appwrite";
export const createSafepayTracker = async (amount: number, orderId: string) => {
  try {
    const result = await appwriteFunc.createExecution({
      functionId: "safepay-tracker",
      body: JSON.stringify({ amount, orderId }),
      method: ExecutionMethod.POST,
      async: false,
      xpath: "/",
      headers: { "Content-Type": "application/json" },
    });

    return JSON.parse(result.responseBody);
  } catch (err) {
    console.error("Function call failed:", err);
    throw err;
  }
};
