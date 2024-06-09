import db from "@/lib/db";

async function getPosts() {
  // await new Promise((r) => setTimeout(r, 100000));
  const posts = await db.post.findMany({});
  return posts;
}

export default async function Life() {
  const posts = await getPosts();
  return <div className="text-white text-4xl">Life!</div>;
}
