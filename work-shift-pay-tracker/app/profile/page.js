"use client";
export default function ProfilePage() {
  return (
    <div className="min-h-screen rounded-xl mt-10 bg-gray-100 flex flex-col items-center">

      {/* Main content area */}
      <div className="w-full max-w-6xl mt-6 px-4 flex-grow">
        <div className="bg-white rounded-xl shadow-md p-5 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400 text-lg">Your Profile is empty for now.</p>
        </div>
      </div>
    </div>
  );
}
