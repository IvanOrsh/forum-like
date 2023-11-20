import PostCreateForm from "@/components/posts/PostCreateForm";

type TopicPageProps = {
  params: {
    slug: string;
  };
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = params;

  return (
    <main className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-2">{slug}</h1>
      </div>

      <div>
        <PostCreateForm slug={slug} />
      </div>
    </main>
  );
}
