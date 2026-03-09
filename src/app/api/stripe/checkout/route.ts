import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const priceId = searchParams.get('priceId');

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            const url = new URL('/auth/login', req.url);
            return NextResponse.redirect(url);
        }

        await dbConnect();

        // 1. Find user in database
        let user = await User.findOne({ email: session.user.email });

        // 2. If user doesn't have stripeCustomerId, create one
        if (!user.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: session.user.email,
                name: session.user.name || undefined,
            });

            user.stripeCustomerId = customer.id;
            await user.save();
        }

        // 3. Create Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: user.stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?status=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/pricing?status=cancelled`,
            metadata: {
                userId: user._id.toString(),
            },
        });

        if (!checkoutSession.url) {
            return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
        }

        return NextResponse.redirect(checkoutSession.url);
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
