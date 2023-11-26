import type { CommentWithAuthor } from "@/db/queries/comments";
import Comment from "./Comment";
import { fetchCommentsByPostId } from "@/db/queries/comments";
import { db } from "@/db";

type CommentListProps = {
  postId: string;
};

export default async function CommentList({ postId }: CommentListProps) {
  const comments = await fetchCommentsByPostId(postId);

  if (!comments) {
    return (
      <div className="m-4">
        <h1>Nobody has commented yet!</h1>
      </div>
    );
  }

  // find parent comment
  const topLevelCommnets = comments.filter(
    (comment) => comment.parentId === null
  );

  const renderedComments = topLevelCommnets.map((comment) => (
    <Comment key={comment.id} commentId={comment.id} postId={postId} />
  ));

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">All {comments.length} comments</h1>
      {renderedComments}
    </div>
  );
}
