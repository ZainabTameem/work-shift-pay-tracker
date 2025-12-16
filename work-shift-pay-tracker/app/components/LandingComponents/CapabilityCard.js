"use client";

import Image from "next/image";

export default function CapabilityCard({
  title,
  description,
  stat,
  footer,
}) {
  return (
    <div className="relative w-[300px] h-[250px] rounded-lg bg-[#E8FFF0] p-6">
      {/* Icon */}
      <div className="absolute top-4 left-4">
        <Image src="/Workly.svg" alt="Workly" width={40} height={40} />
      </div>

      {/* Content */}
      <div className="mt-14 flex flex-col gap-2">
        {stat ? (
          <>
            <h3 className="text-2xl font-semibold">{stat}</h3>
            <p className="text-lg font-medium">{description}</p>
            {footer && (
              <p className="text-sm text-gray-600">{footer}</p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-700">{description}</p>
          </>
        )}
      </div>
    </div>
  );
}
