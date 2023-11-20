"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";
import { PropsWithChildren } from "react";

export default function FormButton({ children }: PropsWithChildren) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}
