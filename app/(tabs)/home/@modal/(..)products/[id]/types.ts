import { getProduct } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export type InitialProduct = Prisma.PromiseReturnType<typeof getProduct>;

export type ProductProps = {
  product: InitialProduct;
};
