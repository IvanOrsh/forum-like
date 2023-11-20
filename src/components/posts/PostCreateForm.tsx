"use client";

import { useFormState } from "react-dom";
import {
  Input,
  Button,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import { createPost } from "@/actions";
import FormButton from "../common/FormButton";

export default function PostCreateForm() {
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="primary">Create Post</Button>
      </PopoverTrigger>

      <PopoverContent>
        <form action={createPost}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Post</h3>
            <Input
              name="title"
              label="Title"
              labelPlacement="outside"
              placeholder="Title"
            />
            <Input
              name="content"
              label="Content"
              labelPlacement="outside"
              placeholder="Content"
            />

            <FormButton>Submit</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
