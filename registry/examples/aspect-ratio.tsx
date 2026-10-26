import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Site() {
  return (
    <div className="grid w-full max-w-120 items-start gap-4 sm:grid-cols-2">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-card border border-hairline bg-sky-wash">
        <div className="flex size-full items-end p-4 font-display text-body-sm text-fg-brand">16 by 9: a product screen</div>
      </AspectRatio>
      <AspectRatio ratio={1} className="overflow-hidden rounded-card border border-hairline bg-paper">
        <div className="flex size-full items-end p-4 font-display text-body-sm text-fg">1 by 1: a card image</div>
      </AspectRatio>
    </div>
  );
}
