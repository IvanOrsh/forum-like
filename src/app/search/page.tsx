import { redirect } from "next/navigation";

import PostList from "@/components/posts/PostList";
import { fetchPostBySearchTerm } from "@/db/queries/posts";

type SearchPageProps = {
  searchParams: {
    term: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { term } = searchParams;

  if (!term) {
    redirect("/");
  }

  return (
    <>
      <PostList fetchData={() => fetchPostBySearchTerm(term)} />
    </>
  );
}
