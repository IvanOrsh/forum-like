"use client";

import {
  NavbarItem,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import { useSession } from "next-auth/react";
import { signIn, signOut } from "@/actions";

export default function HeaderAuth() {
  const session = useSession();

  if (session.status === "loading") {
    return null;
  }

  if (session.data?.user) {
    return (
      <Popover placement="left">
        <PopoverTrigger>
          <Avatar
            size="lg"
            color="primary"
            src={session.data.user.image || ""}
          />
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <form action={signOut}>
              <Button type="submit">Sign Out</Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex gap-2">
      <NavbarItem>
        <form action={signIn}>
          <Button variant="bordered" type="submit" color="secondary">
            Sign In
          </Button>
        </form>
      </NavbarItem>

      <NavbarItem>
        <form action={signIn}>
          <Button variant="flat" type="submit" color="primary">
            Sign Up
          </Button>
        </form>
      </NavbarItem>
    </div>
  );
}
