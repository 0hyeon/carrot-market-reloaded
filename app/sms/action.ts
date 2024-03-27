"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}
export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  console.log(phone, token);
  /*phone*/
  if (!prevState.token) {
    /*phone validate*/
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      //delete previos token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      //create token
      //send the token using twilio
      return { token: true };
    }
  } else {
    /*token*/
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return { token: true, error: result.error.flatten() };
    } else {
      redirect("/");
    }
  }
}
