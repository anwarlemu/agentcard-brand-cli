"use client";

import { useState } from "react";

import { Field } from "@/components/ui/field";
import { TagsInput } from "@/components/ui/tags-input";

export function Site() {
  const [tags, setTags] = useState(["delta.com", "marriott.com", "not a domain"]);
  return (
    <div className="max-w-170">
      <Field label="Allowed merchants" htmlFor="tags-merchants" help="Press Enter or a comma after each one.">
        <TagsInput id="tags-merchants" tags={tags} onTagsChange={setTags} placeholder="airline.com" isTagInvalid={(tag) => !tag.includes(".") || tag.includes(" ")} />
      </Field>
    </div>
  );
}
