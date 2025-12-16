"use client";

import ProfileInfo from "../components/ProfileComponent/Profile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen rounded-xl mt-10 bg-gray-100 flex flex-col items-center dark:bg-gray-800">
      <div className="w-full max-w-6xl mt-6 px-4 flex-grow">
        <ProfileInfo />
      </div>
    </div>
  );
}