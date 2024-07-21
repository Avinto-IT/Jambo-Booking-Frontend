import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
export default function DialogBox({
  children,
  previewPrimaryImage,
}: {
  children: ReactNode;
  previewPrimaryImage: string;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=""></DialogTitle>
          <DialogDescription className="flex items-center justify-center max-h-[80vh]">
            <Image
              alt="Primary image"
              className=" rounded-md object-cover w-full max-w-screen h-full max-h-screen"
              height={200}
              src={previewPrimaryImage}
              width={400}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
