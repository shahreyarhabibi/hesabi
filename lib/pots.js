// lib/pots.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPots, getUserById } from "@/lib/db";

export async function getPotsData() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    // Add await to all async database functions
    const user = await getUserById(session.user.id);
    const pots = await getPots(session.user.id);

    // Add safety check - ensure pots is an array
    if (!Array.isArray(pots)) {
      console.error("Pots is not an array:", typeof pots, pots);
      // Return empty arrays to prevent errors
      return {
        user,
        pots: [],
      };
    }

    // Transform pots to match the expected format
    const formattedPots = pots.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || p.name,
      target: p.target_amount,
      saved: p.saved_amount || 0,
      color: p.color || "#3B82F6",
      icon: p.icon || "piggy-bank",
      deadline: p.deadline,
      createdAt: p.created_at,
      progressColor: p.color || "#3B82F6",
    }));

    return {
      user,
      pots: formattedPots,
    };
  } catch (error) {
    console.error("Error fetching pots data:", error);
    // Return a safe default structure instead of null
    return {
      user: null,
      pots: [],
    };
  }
}
