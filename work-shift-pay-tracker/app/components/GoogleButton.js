"use client";

export function GoogleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center
        w-[150px] h-[50px]
        border-2 border-[#0E4C58]
        rounded-[40px]
        text-[#0E4C58]
        transition duration-150
        cursor-pointer
        hover:bg-[#0E4C58]/10
      "
    >
      {/* Icon from public folder */}
      <img
        src="/GoogleIcon.svg"  // <-- references public/google.svg
        alt="Google"
        className="w-6 h-6 ml-6"
      />

      {/* Button text */}
      <span className="flex-1 text-center mr-6 font-medium">
        Google
      </span>
    </button>
  );
}
