"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useShiftContext } from "../../context/ShiftContext";
import { getShifts, updateShift } from "../../lib/firestore";
import ShiftForm from "../../components/shifts/ShiftForm";

export default function EditShiftPage() {
  const { user } = useAuth();
  const { editShiftId } = useShiftContext();
  const router = useRouter();
  const [shift, setShift] = useState(null);

  useEffect(() => {
    if (!editShiftId) router.push("/shifts/view");
    if (user && editShiftId) {
      getShifts(user.uid).then((data) => {
        setShift(data.find((s) => s.id === editShiftId));
      });
    }
  }, [user, editShiftId, router]);

  if (!shift) return null;

  const handleUpdate = async (data) => {
    await updateShift(user.uid, editShiftId, data);
    router.push("/shifts/view");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <ShiftForm initialData={shift} onSubmit={handleUpdate} />
    </div>
  );
}