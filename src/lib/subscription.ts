import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const DAY_IN_MS = 86_400_000;

export async function checkSubscription() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return false;
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return false;
    }

    const isValid =
        user.stripePriceId &&
        user.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid;
}
