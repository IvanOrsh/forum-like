import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  Button,
  Avatar,
} from "@nextui-org/react";

import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header>
      <Navbar className="shadow mb-6">
        <NavbarBrand>
          <Link href="/" className="font-bold">
            Forum-like
          </Link>
        </NavbarBrand>

        {/* search */}
        <NavbarContent justify="center">
          <Input />
        </NavbarContent>

        {/* sing in / out */}
        <NavbarContent justify="end">
          <NavbarItem>
            {session?.user ? <div>Signed In</div> : <div>Singed Out</div>}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </header>
  );
}
