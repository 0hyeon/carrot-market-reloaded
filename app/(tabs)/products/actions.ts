"use server";
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 1,
    // 25개를 보여주고싶으면  1을 25로만 바꾸면됌
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
