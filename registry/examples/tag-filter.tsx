"use client";

import { useState } from "react";

import { TagFilter } from "@/components/ui/tag-filter";

export function Site() {
  const [tags, setTags] = useState(["travel", "software"]);
  return (
    <TagFilter
      tags={tags}
      tagOptions={["travel", "software", "office", "meals", "ads"]}
      onAddTag={(tag) => setTags((t) => [...t, tag])}
      onRemoveTag={(tag) => setTags((t) => t.filter((x) => x !== tag))}
    />
  );
}
