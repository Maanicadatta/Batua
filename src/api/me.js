import { auth } from "../firebase";

export async function fetchMe() {
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user.getIdToken();
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Backend /me failed: ${res.status}`);
  return await res.json();
}
