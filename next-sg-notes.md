# 1. Motivation

Traditionally, React is used to make highly interactive, dynamic apps (that rely heavily on JS + data fetching)

- airbnb.com, instagram.com, tiktok.com, etc.

Tons of websites don't require heavy interaction or dynamic data fetching (often referred to as 'static' or 'content driven' sites)

- blogs, news, wikis, educational, events, landing pages, governments, etc.

<br>

**One** of the primary goals of Next is to expand the use of React to static sites.

# 2. Typical problems and solution

| Problem                                                                             | Solution                                                                  |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Need a place to write some code!                                                    | Generate a new Next project by running `npx create-next-app@latest`       |
| Need to show different content on the screen based on the path the user is visiting | Use Next's file-based routing system                                      |
| Need to link between different pages                                                | Use Next's built in `Link` component to navigate between different routes |
| The images we want to show are **really large**                                     | Use Next's built in `Image` component to optimize image loading           |
| Seems like we have a lot of duplicate code ...                                      | Investigate strategies for code-reuse                                     |

# 3. File based routing

- `app` folder - super special folder, the files and folders you place in here determine what routes exist in your app

  - `page.tsx`: define a route the user can visit

    - the file **must** have a `export default` of a React component (name of the component doesn't matter, only used for debugging)

  - the name of the **folder** that a `page.tsx` file is in **controls the route**

# 4. `Image`

- Used with local (located on your project) or remote
- On the server, makes several resized versions of your images for different devices

**Options for sizing the image**:

- if using a **local** image, dimensions are taken from the imported image
- Assign a height and width to the image component
- Assign a 'fill' prop, the image will expand to fill up the parent element

# 5. Prisma TODO: research more!

`npm install prisma --save-dev`
`npx prisma init --datasource-provider sqlite`
`npx prisma migrate dev --name init` - run a migration to create the database

# 6. Creating Records

1. Create a prisma client to access our database
2. Crate a form in SnippetCreatePage
3. Define a **Server Action**. This is a function that will be called when the form is submitted.
4. In the Server Action, **validate the users' input** then **\*create a new snippet**
5. Redirect the user to the Home Page, which lists all the snippets.

---

**Create a prisma client**

/srt/db/index.ts:

```ts
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();
```

# 7. Server Actions

- Number one way to **change data** in next app
- Super close integration with HTML forms
- Server actions are functions that will be called with the values a user entered into a form
- **Server actions cannot be defined in Client Components**

example:

```ts
async function createSnippet(formData: FormData) {
  // this needs to be a server action
  "use server";

  // check the user's input and make sure they're valid
  // TODO: add some validation logic!
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;

  // create a new record in the database
  const snippet = await db.snippet.create({
    data: {
      title,
      code,
    },
  });

  console.log(snippet);

  // redirect to the new snippet
  redirect(`/`);
}
```

# 8. Deeper Dive into Server Actions

**Traditional React App**:

- All JS running in the browser
- When you need to change data, you make an HTTP request to an outside server
- Requests are usually done using functions like `fetch` or the `axios` library

---

With Next, some of out code is running in the browser and some is running on the server.

It can be challenging - yet important - to know where your code is running!

---

**Next Server**

- Next receives form data
- Next passes form data to our server action
- We create a new snippet and redirect the user
- Next sends a response back telling the app to show the home page

# 9. Fetching data

1. Create a **server component** - a component that doesn't have `'use client'` at the top.
2. Mark the component as `async`
3. Make an HTTP request or directly access a database to get your data.
4. Render your data directly, or pass it to a child component.

# 10. Sever Components vs Client Components

Client Component:

- essentially the same kind of React components we are already used to.

<br>

Server Component:

- Bends the rules of traditional components a little bit
- Usually we want to use server components! Better performance + UX

# 11. Server Components

1. By default, all components are server components.
2. We want to use server components. Tons of UX, performance, etc benefits by using them.
3. Can use async / await! Don't need `useState` or `useEffect` to do data fetching!
4. Have few limitations.

```js
export default async function HomePage() {
  const snippets = await db.snippet.findMany();

  return (
    <div>
      {snippets.map((snippet) => (
        <Snippet key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}
```

**Limitations**:

- Cannot use any kind of hook
- Cannot assign any event handlers (client-side events)

# 12. Client Components

1. Created by adding `'use client'` at the very top of the file
2. Have all the usual rules of components
3. Can use hooks, event handlers, etc
4. Cannot directly show a Server Component (there is one exception)

example:

```js
"use client";

import { useState } from "react";

export default function Color() {
  const [color, setColor] = useState("");

  return (
    <div>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {color}
    </div>
  );
}
```

# 13. Special File Names in the 'app' Folder

| Name          | Purpose                                                                            |
| ------------- | ---------------------------------------------------------------------------------- |
| page.tsx      | Displays the primary content for the page                                          |
| layout.txt    | Wraps up the current displayed page. Use to show content common across many pages. |
| not-found.tsx | Displayed when we call the 'notFound' function                                     |
| loading.tsx   | Displayed when a server component is fetching some data                            |
| error.tsx     | Displayed when an error occurs in a server component                               |
| route.tsx     | Defines API endpoints                                                              |

# 14. Server Actions in Client Components

1. Define the Server Action in a Server Component and pass it as props to the Client Component:

- **Server components can't pass event handlers down to client components - this is the one exception**

2. Define The Server Action in a separate file and import it into the Client Component

# 15. Error Handling with Server Actions

1. Remember, a big point of forms is that they can work without JS in the browser.
2. We need to somehow communicate info **from a server action back to a page**
3. `ReactDOM` (not `react`) contains a hook called `useFromState` specifically for this.

---

# 16. The Full Route Cache System

Next implements caching in several locations (can lead to unexpected behavior).

1. **Data Cache** - Responses from requests made with `fetch` are stored and used across requests.
2. **Router Cache** - 'Soft' navigation between routes are cached in the browser and reused when a user revisits a page.
3. **Request Memoization** - Make two or more 'GET' requests with `fetch` during a user's request to your server? Only one 'GET' is actually executed.
4. **Full Route Cache** - **At built time**, Next decides if your route is **static** or **dynamic**. If it is static, the page is rendered and the result is stored. In production, users are given this pre-rendered result.

# 17. What makes a page "dynamic" ? (by default all pages are static)

1. Calling a "dynamic function" or referencing a "dynamic variable" when your route renders:

   1. `cookies.set()`, `cookies.delete()`
   2. `useSearchParams()`, `searchParams prop`

2. Assigning a specific "route segment config" options

   1. `export const dynamic = "force-dynamic"`
   2. `export const revalidate = 0`

3. Calling `fetch` and opting out of caching of the response

   1. `fetch('...', { next: { revalidate: 0 } })`

4. Using a dynamic route
   1. `/snippets/[id]/page.tsx`
   1. `/snippets/[id]/edit/page.tsx`

# 18. Cache Control

There are several ways to control caching:

1. **Time-based**: Every x seconds, ignore the cached response and fetch new data.
2. **On-Demand**: Forcibly purge a cached response
3. **Disable Caching**: Don't do any caching at all

# 19. Time-based Caching

For example

every 3 seconds the next request to route will trigger a rerender:

```js
export const revalidate = 3;

export default async function Page() {
  const snippets = await db.snippets.findMany();

  return (
    <div>
      {snippets.map(...)}
    </div>
  );
}

```

# 20. On-Demand Caching

Dump cache for everything in a page:

```js
import { revalidatePath } from "next/cache";

// When we think data that the '/snippets'
// route uses has changed...

revalidatePath("/snippets");
```

# 21. Disable Caching

Disable all caching for a route:

```js
export const revalidate = 0;

export default async function Page() {
  // never caches!
}
```

```js
export const dynamic = "force-dynamic";

export default async function Page() {
  // never caches!
}
```

# 22. OAuth Setup

1. Create an OAuth app and generate a `client_id` and `client_secret` - `github.com/settings/applications/new`
2. Add `AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET` to `.env.local` file
3. Install `@auth/core`, `@auth/prisma-adapter`, `next-auth` (`next-auth@5.0.0-beta.3`)
4. Make an `auth.ts` file in the `src`. Set up NextAuth and the Prisma Adapter in there.
5. Set up the `app/api/auth/[...nextauth]/route.ts` file to handle the requests between Github servers and ours.
6. Make server actions to sign in and sign out the user (Optional, but highly recommended)

# 23. The Theory behind OAuth (with github)

**OAuth** (Open Authorization) is an open standard protocol that allows secure authorization between different services without sharing the user's credentials. It is commonly used for granting third-party applications access to user resources on a server. The OAuth flow typically involves the following steps:

1. The user initiates the OAuth process by clicking on a "Login with..." button or a similar action.
2. The user is redirected to the authorization server, where they are prompted to log in and grant permissions to the requesting application.
3. Once the user grants permission, the authorization server generates an authorization code or access token.
   The application uses the authorization code or access token to request access to specific resources from the resource server.
4. If the request is valid, the resource server provides the requested resources to the application.
5. The application can then use the obtained access token to make subsequent requests on behalf of the user.

OAuth is widely used by social media platforms, APIs, and other web services to allow users to grant limited access to their data to third-party applications without sharing their login credentials.

<br>

1. User wants to sign up! - \*\*Redirect them to Github with our `client_id`:

   - `github.com/login/oauth/authorize?client_id=123`

2. Github asks user if they're OK sharing information with our app. Is so, they get redirected back to our server:

   - `localhost:300/api/auth/callback/github?code=456` (authorization callback url)

3. Our server takes the `code` off the request and makes a followup request to Github:

   - `github.com/login/oauth/access_token?client_id=123&client_secret=456&code=456`

4. Github makes sure the `client_secret`, `client_id`, and `code` are valid, and returns an `access_token`:

   - `localhost:300/api/auth/callback/github?access_token=789`

5. We make another request with `access_token` to get details about the user (name, email, etc):

   - `api.github.com/user`, `Authorization: Bearer 789` (token in the header)

6. Github responds with the user's profile:

   - `{name, email, avatar}`

7. We create a new `User` record in the database.

8. We send a cookie back to the users browser, which will be included with all future requests automatically. That cookie tell us who is making a request to our server.

# 24. Sign In, Sign Out and Checking Auth Status

**Sign in / Sign up**:

```tsx
import * as actions from "@/actions";

export default async function Page() {
  return (
    <form action={actions.signIn}>
      <button type="submit">Sign In</button>
    </form>
  );
}
```

---

**Sign Out**:

```tsx
import * as actions from "@/actions";

export default async function Page() {
  return (
    <form action={actions.signOut}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
```

---

**See if a user is signed in from a Server Component**:

```tsx
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (session?.user) {
    return <div>Signed in as {session.user.email}</div>;
  }

  return <div>Signed out</div>;
}
```

---

**See if a user is signed in from a Client Component**

Requires a 'SessionProvider' to be set up in the `providers.tsx` file

```tsx
import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  if (session.data?.user) {
    return <div>Signed in!</div>;
  }
  return <div>Signed out!</div>;
}
```

# 25. Recommended Initial Design

1. Identify all the different routes you want your app to have + the data that each shows
2. Make 'path helper' functions
3. Create your routing folders + `page.tsx` files based on step #1
4. Identify the places where data changes in your app.
5. Make empty server actions for each fo those
6. Add in comments on what paths you'll need to revalidate for each server action.

# 26. Where to Fetch Data:

**Option 1: Page component gets data, passes it to child**:

pros:

- Easy to see what data a route needs to be displayed
- Easier to make the child component reusable
- Easier to avoid "n+1" query issues

cons:

- Can lead to overfetching data
- Can lead to duplicate code in other Pages using the child component
- Sometimes annoying to write the interface for complex query data

---

**Option 2: Child component fetches its own data**:

pros:

- Easier to build 'skeleton' loading pages

cons:

- Child components implementation is **locked in**

---

**Option 3 (recommended one) - Post Query File (for example)**

Separate file that lists all the queries that can provide data to 'PostList'

```ts
type PostWithData = Post & {
  topic: { slug: string };
  _count: { comments: number };
  user: { name: string };
};

export function fetchPostBySlug(slug: string): Promise<PostWithData> {
  //...
}

export function fetchTopPosts(): Promise<PostWithData[]> {
  //...
}
```

```ts
interface PostListProps {
  fetchPosts: () => Promise<PostWithData[]>;
}
```

# 27. Duplicate Queries

Normally having components individually fetch their data is bad! It leads to duplicate queries to the database!

We can use another cache system to **deduplicate** these queries.

<!-- TODO: Request memoization -->

- The cache memoization system is cleared out between incoming requests
- Automatically used with the built-in `fetch` function
- Can be used with other functions (like db queries) by using the `cache` function

using the `cache` function:

```ts
import { cache } from "react";

import type { Comment } from "@prisma/client";
import { db } from "..";

export type CommentWithAuthor = Comment & {
  user: {
    name: string | null;
    image: string | null;
  };
};

export const fetchCommentsByPostId = cache(
  (postId: string): Promise<CommentWithAuthor[]> => {
    return db.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
);
```

# 28. Adding in Component Streaming

We are going to use `Suspense`:

```txt
           PostPage
------------       |
|                  |
Suspense     Suspense
|                  |
Post       CommentList
|                  |
HTML for Post   HTML for CommentList

```

example:

```tsx
import Link from "next/link";
import { Suspense } from "react";

import paths from "@/paths";
import Post from "@/components/posts/Post";
import CommentCreateForm from "@/components/comments/CommentCreateForm";
import CommentList from "@/components/comments/CommentList";

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
      <Suspense fallback={<div>Loading...</div>}>
        <Post postId={postId} />
      </Suspense>

      <CommentCreateForm postId={postId} startOpen />
      <CommentList postId={postId} />
    </div>
  );
}
```

# 29. Notes on QueryStrings in Next

Page components receive the query string data trough the `searchParams` prop:

```tsx
interface SearchParams {
  searchParams: {
    term: string;
  };
}

function SearchPage({ searchParams }: SearchParams) {
  return <div>{searchParams.term}</div>;
}
```

<br>

Client components can get query string data through `useSearchParams`:

```tsx
"use client";

import { useSearchParams } from "next/navigation";

function SearchInput() {
  const searchParams = useSearchParams();

  return <div>{searchParams.term}</div>;
}
```

**Client components with `useSearchParams` need to be wrapped with `Suspense` or you'll get a strange warning at build time!**:

```tsx
function Page() {
  return (
    <div>
      <Suspense>
        <SearchInput />
      </Suspense>
    </div>
  );
}
```
