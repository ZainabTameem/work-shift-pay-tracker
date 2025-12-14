import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function addShift(uid, data) {
  await addDoc(collection(db, "users", uid, "shifts"), data);
}

export async function getShifts(uid) {
  const snap = await getDocs(collection(db, "users", uid, "shifts"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteShift(uid, id) {
  await deleteDoc(doc(db, "users", uid, "shifts", id));
}