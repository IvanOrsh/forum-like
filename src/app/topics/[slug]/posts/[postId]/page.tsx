import Link from "next/link";

import paths from "@/paths";
import Post from "@/components/posts/Post";
import CommentCreateForm from "@/components/comments/CommentCreateForm";
import CommentList from "@/components/comments/CommentList";
import { fetchCommentsByPostId } from "@/db/queries/comments";

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

      <CommentCreateForm postId={postId} startOpen />
      <CommentList fetchData={() => fetchCommentsByPostId(postId)} />
    </div>
  );
}
