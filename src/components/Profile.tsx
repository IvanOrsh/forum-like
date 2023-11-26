"use client";

import { signIn, signOut } from "@/actions";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  if (session.data?.user) {
    return (
      <>
        <div>
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
        <div>From client: {JSON.stringify(session.data.user)}</div>
      </>
    );
  }

  return (
    <>
      <div>
        <Button onClick={() => signIn()}>Sign in</Button>
      </div>
      <div>From client: user is not signed in</div>
    </>
  );
}
