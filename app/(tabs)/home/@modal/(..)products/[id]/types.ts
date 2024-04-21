import { getProduct } from "@/app/products/[id]/page";
import { Prisma } from "@prisma/client";

export type InitialProduct = Prisma.PromiseReturnType<typeof getProduct>;

export type ProductProps = {
  product: InitialProduct;
};
