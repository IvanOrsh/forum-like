import Link from "next/link";

import { db } from "@/db";
import paths from "@/paths";
import Post from "@/components/posts/Post";

type PostPageProps = {
  params: {
    slug: string;
    postId: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug, postId } = params;

  return (
    <div className="space-y-3">
      <Link className="underline decoration-solid" href={paths.topicShow(slug)}>
        {"< "}Back to {slug}
      </Link>
      <Post postId={postId} />
      {/* CommentCreateForm */}
      {/* CommentList */}
    </div>
  );
}
