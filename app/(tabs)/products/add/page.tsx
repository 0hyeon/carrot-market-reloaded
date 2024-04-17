"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { MB } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  /*이미지체크*/
  const isOversizeImage = (file: File): boolean => {
    if (file.size > 5 * MB) {
      alert("파일 크기가 5MB를 초과했습니다.");
      return true;
    }
    return false;
  };
  const reset = () => setPreview("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension && !allowedExtensions.includes(fileExtension)) {
      alert("이미지 파일은 jpg, jpeg, 또는 png 형식이어야 합니다.");
      return;
    }
    if (isOversizeImage(file)) return; // 파일 용량 체크
    const url = URL.createObjectURL(file); // 브라우저 메모리에 임시 저장된 인풋 업로드 파일을 참조하는 가상 URL 생성
    setPreview(url);
    setFile(file);

    /*업로드할 (안전한) CF url 받기 */
    const test = await getUploadUrl();
    console.log("test : ", test);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      console.log("result : ", result);
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/z_5GPN_XNUgqhNAyIaOv1A/${id}`
      );
    }
  };
  const onSubmit = handleSubmit(async (data: ProductType) => {
    // formData 안의 photo를 Image의 URL로 교체하는것
    // => 이미지를 업로드하면 이미지주소가아닌 CF의 URL로교체하는코드

    if (!file) return;

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) return;

    //formData안에 있던 photo를 교체하는것 이전에는 파일형태
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);
    return uploadProduct(formData);
    // replace `photo ` in formData
    // call upload product.
  });
  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {errors.photo?.message}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          {...register("price")}
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button type="submit" text="작성완료" />
        <Button type="reset" text="초기화" onClick={reset}></Button>
      </form>
    </div>
  );
}
