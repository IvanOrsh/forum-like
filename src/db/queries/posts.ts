import type { Post } from "@prisma/client";
import { db } from "../index";

// export type PostWithData = Post & {
//   topic: {
//     slug: string;
//   };
//   user: {
//     name: string | null;
//   };
//   _count: { comments: number };
// };

export type PostWithData = Awaited<
  ReturnType<typeof fetchPostsByTopicSlug>
>[number];

export function fetchPostsByTopicSlug(
  slug: string
) /*: Promise<PostWithData[]>*/ {
  return db.post.findMany({
    where: {
      topic: {
        slug,
      },
    },
    include: {
      topic: true,
      user: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
}

export function fetchTopPosts(): Promise<PostWithData[]> {
  return db.post.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    include: {
      topic: true,
      user: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    take: 5,
  });
}
