"use server";
import getSession from "@/lib/session";
import db from "../../../../lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "../../add/schema";

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      photo: true,
      title: true,
      price: true,
      description: true,
      userId: true,
    },
  });
  return product;
}

export async function deletePhoto(photoId: string) {
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function editProduct(formData: FormData) {
  const session = await getSession();
  if (!session.id) return;
  const data = {
    id: formData.get("id"),
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const product = await db.product.update({
      where: {
        id: result.data.id,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    revalidatePath("/home");
    revalidateTag("product-detail");
    redirect(`/home/${product.id}`);
  }
}
"use server";


export const onDelete = async (id: number, isOwner: boolean) => {
  if (!isOwner) return;
  const product = await db.product.delete({
    where: {
      id,
    },
    select: {
      photo: true,
    },
  });
  const photoId = product.photo.split(
    "https://imagedelivery.net/WsRbszCcxsT0fi684EYNNQ/"
  )[1];
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  revalidatePath("/home");
  revalidateTag("product-detail");
};