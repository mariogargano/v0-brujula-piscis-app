-- Add trial-related fields to profiles table
-- This tracks subscription trial status

-- Add trial_ends_at to track when free trial ends
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Add stripe_customer_id to link with Stripe
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add stripe_subscription_id to track active subscription
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add subscription_status to track current status
-- Values: 'trialing', 'active', 'canceled', 'past_due', 'unpaid'
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';

-- Comment on columns for clarity
COMMENT ON COLUMN profiles.trial_ends_at IS 'When the 7-day free trial ends';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Current Stripe subscription ID';
COMMENT ON COLUMN profiles.subscription_status IS 'Subscription status: none, trialing, active, canceled, past_due, unpaid';
