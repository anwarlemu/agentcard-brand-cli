import { ChevronLeft, ChevronRight, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

export function Site() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonGroup aria-label="Pages">
        <Button variant="secondary" size="icon" aria-label="Previous page">
          <ChevronLeft />
        </Button>
        <Button variant="secondary" size="icon" aria-label="Next page">
          <ChevronRight />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Receipt">
        <Button variant="secondary">
          <Copy />
          Copy
        </Button>
        <Button variant="secondary">
          <Download />
          Download
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Approve">
        <Button>Approve</Button>
        <ButtonGroupSeparator />
        <Button aria-label="More options" size="icon">
          <ChevronRight />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export function WithText() {
  return (
    <div className="grid w-full max-w-100 gap-4">
      <ButtonGroup className="w-full">
        <ButtonGroupText>https://</ButtonGroupText>
        <Input aria-label="Merchant site" defaultValue="shop.example.com" className="rounded-none" />
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Sort" className="w-40">
        <Button variant="secondary">Newest</Button>
        <Button variant="secondary">Largest</Button>
        <Button variant="secondary">Merchant</Button>
      </ButtonGroup>
    </div>
  );
}
