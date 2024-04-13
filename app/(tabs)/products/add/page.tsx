"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { MB } from "@/lib/constants";

export default function AddProduct() {
  const [preview, setPreview] = useState("");

  /*이미지체크*/
  const isOversizeImage = (file: File): boolean => {
    if (file.size > 5 * MB) {
      alert("파일 크기가 5MB를 초과했습니다.");
      return true;
    }
    return false;
  };
  const reset = () => setPreview("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    console.log(files);
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
  };
  return (
    <div>
      <form action={uploadProduct} className="flex flex-col gap-5 p-5">
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
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성완료" />
        <Button type="reset" text="초기화" onClick={reset}></Button>
      </form>
    </div>
  );
}
