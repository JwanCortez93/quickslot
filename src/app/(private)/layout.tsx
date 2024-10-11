import NavLink from "@/components/NavLink";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ReactNode } from "react";

const PrivateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="flex py-2 border-b bg-card">
        <nav className="font-medium flex items-center text-sm gap-6 container">
          <div className="flex items-center gap-2 font-semibold mr-auto">
            <Image
              src="/logo/svg/logo-no-background.svg"
              width={100}
              height={100}
              alt="Logo"
            />
          </div>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/schedule">Schedule</NavLink>
          <div className="ml-auto size-10">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
            />
          </div>
        </nav>
      </header>
      <main className="container my-6">{children}</main>
    </>
  );
};

export default PrivateLayout;
