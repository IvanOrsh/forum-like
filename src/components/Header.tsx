import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";

import HeaderAuth from "./HeaderAuth";
import SearchInput from "./SearchInput";
import { Suspense } from "react";

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
          <Suspense>
            <SearchInput />
          </Suspense>
        </NavbarContent>

        {/* sing in / out */}
        <NavbarContent justify="end">
          <HeaderAuth />
        </NavbarContent>
      </Navbar>
    </header>
  );
}
