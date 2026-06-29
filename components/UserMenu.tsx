"use client";

import { UserButton } from "@clerk/nextjs";
import { useRef } from "react";

export default function UserMenu() {
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {

    const clerkButton = triggerRef.current?.querySelector("button");
    if (clerkButton && clerkButton.contains(e.target as Node)) {
      return;
    }

    clerkButton?.click();
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-2 text-white hover:bg-[var(--color-verde-hoja)] rounded transition cursor-pointer"
    >
      <div ref={triggerRef}>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-5 h-5",
              userButtonTrigger: "focus:shadow-none",
            },
          }}
        />
      </div>
      <span className="text-sm">Mi perfil</span>
    </div>
  );
}