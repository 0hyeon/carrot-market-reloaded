import { getProduct } from "@/app/products/[id]/page";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CloseBtn,
  ProductImage,
  TitleBox,
  UserInfo,
} from "@/app/(tabs)/home/@modal/(..)products/[id]/components";

export default async function Modal({ params }: { params: { id: string } }) {
  const product = await getProduct(Number(params.id));

  // const router = useRouter();
  // const onCloseClick = () => {
  //   router.back();
  // };

  // return (
  //   <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
  //     <button
  //       onClick={onCloseClick}
  //       className="absolute right-5 top-5 text-neutral-200"
  //     >
  //       <XMarkIcon className="size-10" />
  //     </button>
  //     <div className="max-w-screen-sm h-1/2  flex justify-center w-full">
  //       <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center">

  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-60 left-0 top-0">
      <div className="max-w-screen-sm h-1/2 flex justify-center w-full items-center">
        <CloseBtn />
        {product ? (
          <div className="rounded-md flex justify-center items-center flex-wrap relative gap-2">
            <TitleBox product={product} />
            <ProductImage product={product} />
            <UserInfo product={product} />
          </div>
        ) : (
          <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center w-full overflow-hidden">
            <PhotoIcon className="h-28" />
          </div>
        )}
      </div>
    </div>
  );
}
