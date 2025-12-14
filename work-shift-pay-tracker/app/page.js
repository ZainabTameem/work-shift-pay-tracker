"use client";

import HeaderWithAuthButtons from "./components/LandingComponents/HeaderWithAuthButtons";
import CapabilityCard from "./components/LandingComponents/CapabilityCard";
import HeroCard from "./components/LandingComponents/HeroCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithAuthButtons />

      <main className="flex flex-col items-center flex-1 pt-10 pb-16">
        {/* Hero Card */}
        <HeroCard />

        {/* Section heading */}
        <h2 className="text-3xl font-medium mb-2 text-center ">
          CAPABILITIES
        </h2>

        <h1 className="mb-2 text-2xl text-gray-600 max-w-md dark:text-gray-300">
          WHAT SETS US APART
        </h1>

        <p className="mb-10 text-center text-gray-600 max-w-md dark:text-gray-300">
          Built for those who work hourly and need clarity.
        </p>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 dark:text-gray-700 ">
          <CapabilityCard
            title="Earnings estimation that works"
            description="Input your hourly rate and watch the math happen."
          />

          <CapabilityCard
            title="View Shifts"
            description="See all your shifts in one simple, clean display."
          />

          <CapabilityCard
            title="Design that doesn’t get in the way"
            description="A clean and intuitive design language to improve usability."
          />

          <CapabilityCard
            stat="50K"
            description="Active Users"
            footer="People changing their pay every week"
          />

          <CapabilityCard
            stat="2M"
            description="Shifts Tracked"
            footer="Hours logged and organized"
          />

          <CapabilityCard
            stat="98%"
            description="Accuracy Rate"
            footer="Calculations that match paychecks"
          />
        </div>
      </main>
    </div>
  );
}
