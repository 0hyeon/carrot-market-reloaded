"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import { create } from "domain";
import getSession from "@/lib/session";
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format"
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  console.log(exists);
  return Boolean(exists);
}
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");

interface ActionState {
  token: boolean;
}
async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
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
      //phone validate통과

      //기존 delete previos token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      //create token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          //user가없더라도 sMSToken에서 user생성
          user: {
            connectOrCreate: {
              where: {
                //user 있고 맵핑
                phone: result.data,
              },
              create: {
                //user가 아예없어서 등록할때
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      //send the token using twilio
      return { token: true };
    }
  } else {
    /*token*/
    const result = await tokenSchema.spa(token); //토큰유효성검사
    if (!result.success) {
      return { token: !result.success, error: result.error.flatten() };
    } else {
      //토큰통과

      //토큰맵핑해서찾음
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      const session = await getSession();
      session.id = token!.userId;
      await session.save();
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      //log the user in
      redirect("/profile");
    }
  }
}
