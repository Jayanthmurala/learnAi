import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });

        if (!user || !user.stripeCustomerId) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Create billing portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        });

        return NextResponse.redirect(portalSession.url);
    } catch (error: any) {
        console.error('Portal error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
