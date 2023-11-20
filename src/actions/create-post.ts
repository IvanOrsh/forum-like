"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import type { Post } from "@prisma/client";
import { db } from "@/db";
import paths from "@/paths";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

type CreatePostFormState = {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
};

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // topicId
  const topic = await db.topic.findFirst({
    where: {
      slug,
    },
  });
  if (!topic) {
    return {
      errors: {
        _form: ["Topic not found."],
      },
    };
  }

  // session
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this."],
      },
    };
  }

  // db
  let post: Post;
  try {
    const topicId = await db;
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    }

    return {
      errors: {
        _form: ["Something went wrong. Please try again later."],
      },
    };
  }

  // revalidate topic page
  revalidatePath(paths.topicShow(slug));
  redirect(paths.postShow(slug, post.id));
}
