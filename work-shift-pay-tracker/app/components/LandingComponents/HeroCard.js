"use client";

export default function HeroCard() {
  return (
    <section className="w-full flex justify-center pb-8">
      <div className="max-w-6xl w-full bg-[#E8FFF0] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT: Image fills column */}
        <div className="w-full h-full">
          <img
            src="/PlaceholderImage.png"
            alt="App preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT: Text content */}
        <div className="px-10 py-12 flex flex-col gap-4 justify-center">
          <h1 className="text-3xl md:text-4xl font-medium dark:text-gray-700">
            Know what you’ll earn <br /> before the week ends
          </h1>

          <p className="text-gray-600 max-w-md">
            Workly helps hourly workers understand their income clearly and confidently.
            By tracking shifts, hours, and pay rates in one place, you always know
            where your money comes from.
          </p>

          <p className="text-gray-600 max-w-md">
            Whether your schedule changes weekly or your hours vary day to day,
            Workly gives you an accurate view of your expected earnings.
            No guessing, no spreadsheets, no surprises on payday.
          </p>
        </div>

      </div>
    </section>
  );
}

