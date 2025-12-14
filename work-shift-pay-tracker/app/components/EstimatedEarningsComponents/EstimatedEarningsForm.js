"use client";

export default function EstimatedEarningsForm() {
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-2xl font-semibold text-[#0E4C58] mb-6">
        Weekly Earnings
      </h2>

      <div className="space-y-6 mb-10">

        {/* Weekly Hours Block */}
        <div className="bg-[#F3FBF7] p-5 rounded-xl border border-[#D9F0E6]">
          <p className="text-lg font-medium text-gray-700">Weekly Hours</p>
          <p className="text-sm text-gray-500 mb-3">
            Total number of hours worked from Monday–Sunday
          </p>

          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-gray-600">Calculated Weekly Hours</p>
            <p className="text-xl font-semibold text-[#0E4C58]">
              -- hours
            </p>
          </div>
        </div>

        {/* Overtime Hours Block */}
        <div className="bg-[#F3FBF7] p-5 rounded-xl border border-[#D9F0E6]">
          <p className="text-lg font-medium text-gray-700">Overtime Hours</p>
          <p className="text-sm text-gray-500 mb-3">
            Hours above 8 per shift will be counted as overtime
          </p>

          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-gray-600">Total Overtime Hours</p>
            <p className="text-xl font-semibold text-[#0E4C58]">
              -- hours
            </p>
          </div>
        </div>

      </div>

      <p className="text-center text-gray-500">
        Earnings calculator coming soon...
      </p>
    </div>
  );
}
