import db from "@/lib/db";

export interface User {
  username: string;
  avatar: string | null;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  photo: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  userId: number;
  user: User;
}

export async function getProduct(id: number): Promise<Product | null> {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export async function getProductTitle(
  id: number
): Promise<{ title: string } | null> {
  console.log("title");
  const product = await db.product.findUnique({
    where: { id },
    select: { title: true },
  });
  return product;
}
export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}
export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}
