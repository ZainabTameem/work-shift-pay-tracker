"use client";

const MAIN_COLOR = "#0E4C58";

// Square Outline
export function SquareOutlineButton({ text = "Button", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[185px] h-[55px]
        border-2 border-[${MAIN_COLOR}]
        text-[${MAIN_COLOR}]
        transition duration-150
        cursor-pointer
      `}
    >
      {text}
    </button>
  );
}

// Square Filled
export function SquareFilledButton({ text = "Button", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[185px] h-[55px]
        bg-[${MAIN_COLOR}]
        text-white
        transition duration-150
        cursor-pointer
      `}
    >
      {text}
    </button>
  );
}

// Rounded Outline
export function RoundedOutlineButton({ text = "Button", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[150px] h-[55px]
        border-2 border-[${MAIN_COLOR}]
        text-[${MAIN_COLOR}]
        rounded-[40px]
        transition duration-150
        cursor-pointer
      `}
    >
      {text}
    </button>
  );
}

// Rounded Filled
export function RoundedFilledButton({ text = "Button", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[150px] h-[55px]
        bg-[${MAIN_COLOR}]
        text-white
        rounded-[40px]
        transition duration-150
        cursor-pointer
      `}
    >
      {text}
    </button>
  );
}
