import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
}
async function getProduct(id: number) {
  const product = db.product.findUnique({
    where: {
      id,
    },
  });
  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  return <div>ProductDetail detail of the product{id}</div>;
}
