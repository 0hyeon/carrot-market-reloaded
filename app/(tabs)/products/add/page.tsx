"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { MB } from "@/lib/constants";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setImageId] = useState("");
  /*이미지체크*/
  const isOversizeImage = (file: File): boolean => {
    if (file.size > 5 * MB) {
      alert("파일 크기가 5MB를 초과했습니다.");
      return true;
    }
    return false;
  };
  const reset = () => setPreview("");
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

    /*업로드할 (안전한) CF url 받기 */
    const test = await getUploadUrl();
    console.log("test : ", test);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      console.log("result : ", result);
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };
  const interceptAction = async (_: any, formData: FormData) => {
    // formData 안의 photo를 Image의 URL로 교체하는것
    // => 이미지를 업로드하면 이미지주소가아닌 CF의 URL로교체하는코드
    const file = formData.get("photo");
    if (!file) return;

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) return;
    const photoUrl = `https://imagedelivery.net/z_5GPN_XNUgqhNAyIaOv1A/${photoId}`;
    //formData안에 있던 photo를 교체하는것 이전에는 파일형태
    formData.set("photo", photoUrl);
    return uploadProduct(_, formData);
    // replace `photo ` in formData
    // call upload product.
  };
  const [state, action] = useFormState(interceptAction, null);
  return (
    <div>
      <form action={action} className="flex flex-col gap-5 p-5">
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
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button type="submit" text="작성완료" />
        <Button type="reset" text="초기화" onClick={reset}></Button>
      </form>
    </div>
  );
}
