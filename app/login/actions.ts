"use server";

import { redirect } from "next/navigation";

export async function handleForm(prevState: any, formData: FormData) {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // console.log(formData.get("email"), formData.get("password"));
  // console.log("i run in the server baby!");
  redirect("/");
  return {
    error: ["wrong password", "password too short"],
  };
}
