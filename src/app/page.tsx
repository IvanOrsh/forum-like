import Image from "next/image";
import { Button } from "@nextui-org/react";

import * as actions from "@/actions";
import { auth } from "@/auth";
import Profile from "@/components/Profile";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <header className="flex items-center justify-between gap-4 p-4 border border-zinc-400">
        <div>Logo Goes Here</div>

        <div className="flex gap-4 items-center">
          <form action={actions.signIn}>
            <Button color="primary" type="submit">
              Sign In
            </Button>
          </form>

          <form action={actions.signOut}>
            <Button color="danger" type="submit">
              Sign Out
            </Button>
          </form>

          {session?.user ? (
            <>
              <div>Signed in as {session.user.email}</div>
              {session.user.image && (
                <Image
                  src="https://avatars.githubusercontent.com/u/102155622?v=4"
                  alt="user avatar"
                  width={50}
                  height={50}
                />
              )}
            </>
          ) : (
            <div>Not signed in</div>
          )}
        </div>
      </header>

      <main>
        <Profile />
      </main>
    </>
  );
}
