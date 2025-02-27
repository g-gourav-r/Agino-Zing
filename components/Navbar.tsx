import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconUpload, IconMessage2 } from "@tabler/icons-react";

export function Navbar() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "Upload",
      icon: (
        <IconUpload className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/upload",
    },
    {
      title: "Chat",
      icon: (
        <IconMessage2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/chat",
    },
  ];
  return (
    <div className="flex items-start mt-10 justify-start ">
      <FloatingDock mobileClassName="translate-y-20" items={links} />
    </div>
  );
}
