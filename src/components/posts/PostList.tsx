import Link from "next/link";

import type { Post, User, Topic } from "@prisma/client";
import { db } from "@/db";
import paths from "@/paths";

type PostListProps = {
  slug: string;
};

export default async function PostList({ slug }: PostListProps) {
  const topic = await db.topic.findFirst({
    where: {
      slug,
    },
  });

  if (!topic) {
    return (
      <div className="m-4">
        <h1>Topic not found</h1>
      </div>
    );
  }

  const posts = await db.post.findMany({
    where: {
      topic: {
        id: topic.id,
      },
    },
    include: {
      user: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const renderPosts = posts.map((post) => (
    <div key={post.id} className="border rounded p-2">
      <Link href={paths.postShow(slug, post.id)}>
        <h3 className="text-lg font-bold">{post.title}</h3>
        <div className="flex flex-row gap-8">
          <p className="text-xs text-gray-400">By {post.user.name}</p>
          <p className="text-xs text-gray-400">
            {post._count.comments} comments
          </p>
        </div>
      </Link>
    </div>
  ));

  return <div className="space-y-2">{renderPosts}</div>;
}
