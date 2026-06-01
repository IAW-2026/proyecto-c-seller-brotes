"use client";

import { UserButton } from "@clerk/nextjs";

export default function UserMenu() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-white hover:bg-[var(--color-verde-hoja)] rounded transition cursor-pointer">
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-5 h-5",
            userButtonTrigger: "focus:shadow-none",
          },
        }}
      />
      <span className="text-sm">Mi perfil</span>
    </div>
  );
}