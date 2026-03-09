import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;

    if (!signature) {
        return new NextResponse('No Signature', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    await dbConnect();

    // 1. New Subscription Completed
    if (event.type === 'checkout.session.completed') {
        const subscription = (await stripe.subscriptions.retrieve(
            session.subscription as string
        )) as any;

        if (!session?.metadata?.userId) {
            return new NextResponse('User ID not found in metadata', { status: 400 });
        }

        await User.findByIdAndUpdate(session.metadata.userId, {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
            ),
        });
    }

    // 2. Subscription Renewed/Updated
    if (event.type === 'invoice.payment_succeeded') {
        const subscription = (await stripe.subscriptions.retrieve(
            session.subscription as string
        )) as any;

        await User.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                ),
            }
        );
    }

    return new NextResponse(null, { status: 200 });
}
