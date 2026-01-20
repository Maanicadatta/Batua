import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase";

export async function enableAuthPersistence() {
  await setPersistence(auth, browserLocalPersistence);
}
