import { HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function TabBar() {
  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3">
      <Link href="/products">
        <HomeIcon className="w-7 h-7" />
        <span>홈</span>
      </Link>
      <Link href="/life">
        <HomeIcon className="w-7 h-7" />
        <span>동네생활</span>
      </Link>
      <Link href="/chat">
        <HomeIcon className="w-7 h-7" />
        <span>채팅</span>
      </Link>
      <Link href="/live">
        <HomeIcon className="w-7 h-7" />
        <span>쇼핑</span>
      </Link>
      <Link href="/profile">
        <HomeIcon className="w-7 h-7" />
        <span>나의당근</span>
      </Link>
    </div>
  );
}
