import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import { getComments } from "./action";
import { CommentList } from "@/components/comment-list";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

//revalidatePath때문에 좋아요클릭시 코디이 재실행돼 조회수가 올라가는 바람직하지 못한 현상을 막기위해 Caching의 막강한 힘사용
//posts, like갯수 , inLiked 여부도 캐싱할거임 (최초1회만 view+1 하기위함)
const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

//like갯수와 isLiked여부 두가지 리턴
async function getLikeStatus(postId: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

//like갯수와 isLiked여부 (두가지) 캐싱
function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}
function getCachedComments(postId: number) {
  const cachedComments = nextCache(getComments, ["comments"], {
    tags: [`comments-${postId}`],
  });
  return cachedComments(postId);
}

async function getMe() {
  const mySession = await getSession();
  const me = mySession.id
    ? await db.user.findUnique({
        where: {
          id: mySession.id,
        },
        select: {
          id: true,
          avatar: true,
          username: true,
        },
      })
    : null;
  return me;
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  const allComments = await getCachedComments(post.id);
  const me = await getMe();
  return (
    <div className=" text-white relative min-h-screen">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar ?? "/avatar.svg"}
            alt={post.user.username}
          />
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <LikeButton
            postId={post.id}
            isLiked={isLiked}
            likeCount={likeCount}
          />
        </div>
      </div>
      <CommentList postId={post.id} allComments={allComments} me={me} />
    </div>
  );
}
