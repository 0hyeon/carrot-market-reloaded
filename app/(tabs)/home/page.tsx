import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

/*cached fn*/
const getCachedProducts = nextCache(
  getInitialProducts,
  ["home-products"]
  //   {
  //   revalidate: 60,
  // }
);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;
export const metadata = {
  title: "Home",
};
// export const revalidate = 60; //언제나 바로 html을 보게될거고 랜더링시마다 항상 db에 접근하지 않는다. [시간을이용해 새로고침]
export const dynamic = "force-dynamic"; //디폴트는 auto , 유저가 새로고침할때마다 db호출 , 써드파티등 새로운 최신데이터를 새로고침마다 호출하고싶을때.[요청시 새로고침]

export default async function Products() {
  const initialProducts = await getCachedProducts(); //캐싱
  const revalidate = async () => {
    "use server";
    revalidatePath("/home"); //해당 url과 관련된 캐시는 초기화될것 즉, 업데이트된다
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>revalidate</button>
        {/* 클릭후 새로고침하면 업데이트된데이터가 보인다.  */}
      </form>
      <Link
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
        href="/products/add"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
