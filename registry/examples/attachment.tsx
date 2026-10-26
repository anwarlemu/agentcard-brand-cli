"use client";

import * as React from "react";
import { Download, FileSpreadsheet, FileText, Image as ImageIcon, Receipt, RotateCw, X } from "lucide-react";

import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment";

// A card drawn in the brand's blue and sky, as a stand-in for a photo of a receipt.
const CARD_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#CCDBFF"/><rect x="18" y="34" width="84" height="54" rx="6" fill="#0000FF"/><rect x="28" y="46" width="16" height="12" rx="2" fill="#FFFFFF"/></svg>')}`;

export function Site() {
  const [files, setFiles] = React.useState([
    { name: "receipt-amazon-oct-14.pdf", size: "248 KB", icon: Receipt },
    { name: "travel-spend-q3.csv", size: "1.2 MB", icon: FileSpreadsheet },
    { name: "card-policy.txt", size: "3 KB", icon: FileText },
  ]);
  return (
    <AttachmentGroup className="max-w-full">
      {files.map(({ name, size, icon: Icon }) => (
        <Attachment key={name}>
          <AttachmentTrigger aria-label={`Open ${name}`} />
          <AttachmentMedia>
            <Icon strokeWidth={1.5} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
            <AttachmentDescription>{size}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${name}`} onClick={() => setFiles((all) => all.filter((f) => f.name !== name))}>
              <X />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Attachment state="idle">
        <AttachmentMedia>
          <FileText strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>expense-policy.pdf</AttachmentTitle>
          <AttachmentDescription>Waiting</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia>
          <Receipt strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>hotel-invoice.pdf</AttachmentTitle>
          <AttachmentDescription>62% of 4.8 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error">
        <AttachmentMedia>
          <FileSpreadsheet strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>all-transactions.csv</AttachmentTitle>
          <AttachmentDescription>Larger than 25 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Retry all-transactions.csv">
            <RotateCw />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CARD_IMAGE} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>card-photo.png</AttachmentTitle>
          <AttachmentDescription>94 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Download card-photo.png">
            <Download />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment orientation="vertical" state="processing">
        <AttachmentMedia>
          <ImageIcon strokeWidth={1.5} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>receipt-scan.png</AttachmentTitle>
          <AttachmentDescription>Reading the total</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Attachment key={size} size={size}>
          <AttachmentMedia>
            <Receipt strokeWidth={1.5} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>receipt.pdf</AttachmentTitle>
            <AttachmentDescription>248 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  );
}
