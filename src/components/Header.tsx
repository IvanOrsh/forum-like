import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, Input } from "@nextui-org/react";

import HeaderAuth from "./HeaderAuth";

export default function Header() {
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
          <HeaderAuth />
        </NavbarContent>
      </Navbar>
    </header>
  );
}
