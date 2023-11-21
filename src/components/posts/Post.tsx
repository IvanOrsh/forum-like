import { db } from "@/db";

type PostProps = {
  postId: string;
};

export default async function Post({ postId }: PostProps) {
  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return (
      <div className="m-4">
        <h1>Post not found</h1>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold my-2">{post.title}</h1>
      <p className="p-4 border rounded">{post.content}</p>
    </div>
  );
}
