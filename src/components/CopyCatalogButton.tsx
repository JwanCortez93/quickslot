"use client";

import { Copy, CopyCheck, CopyX } from "lucide-react";
import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";

type CopyState = "idle" | "copied" | "error";

const CopyCatalogButton = ({
  clerkUserId,
  ...buttonProps
}: Omit<ButtonProps, "children" | "onClick"> & {
  clerkUserId: string;
}) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const CopyIcon = getCopyIcon(copyState);

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        navigator.clipboard
          .writeText(`${location.origin}/book/${clerkUserId}`)
          .then(() => {
            setCopyState("copied");
            setTimeout(() => setCopyState("idle"), 2000);
          })
          .catch(() => {
            setCopyState("error");
            setTimeout(() => setCopyState("idle"), 2000);
          });
      }}
    >
      <CopyIcon className="size-4 mr-2" />
      {getChildren(copyState)}
    </Button>
  );
};

const getCopyIcon = (copyState: CopyState) => {
  switch (copyState) {
    case "idle":
      return Copy;
    case "copied":
      return CopyCheck;
    case "error":
      return CopyX;
  }
};
const getChildren = (copyState: CopyState) => {
  switch (copyState) {
    case "idle":
      return "Copy Catalog Link";
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
  }
};

export default CopyCatalogButton;
