import axios from "axios";
import { signIn } from "next-auth/react";

export const signUpHandler = async (values: any) => {
  try {
    const response = await axios.post("/api/auth/signup", values);
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Signup failed. Please try again.",
      };
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Signup failed",
      };
    }
    return { success: false, message: error.message || "Signup failed" };
  }
};

export const signInHandler = async (values: {
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      role: values.role,
    });

    if (res?.ok) {
      return { success: true, message: "Signed in successfully" };
    } else if (res?.error) {
      return { success: false, message: res.error };
    }

    return { success: false, message: "Sign in failed. Please try again."};
  } catch (error: any) {
    return { success: false, message: "Sign in failed" };
  }
};
