"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RoundedFilledButton, RoundedOutlineButton } from "../Buttons";

export default function HeaderWithAuthButtons({ logoSrc = "/Logo.svg" }) {
  const router = useRouter();

  const goToLogin = () => router.push("/auth/login");
  const goToSignUp = () => router.push("/auth/register");

  return (
    <header className="bg-[#DDFCE7] w-full py-4 shadow-md flex justify-center">
      <div className="flex items-center justify-between w-[1098px] px-6">
        {/* Logo only */}
        <div className="flex items-center gap-4">
          <Image src={logoSrc} alt="Logo" width={200} height={200} />
        </div>

        {/* Rounded buttons on the right */}
        <div className="flex gap-4">
          <RoundedFilledButton text="Sign In" onClick={goToLogin} />
          <RoundedOutlineButton text="Start Free" onClick={goToSignUp} />
        </div>
      </div>
    </header>
  );
}
