import { Resend } from "resend";

let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.warn("Resend initialization failed:", error.message);
}

export async function scheduleDelayedEmail(email, category, frequency, subscriptionTime) {
  if (!resend) {
    console.warn("Resend client not initialized - email scheduling skipped");
    return;
  }

  // Calculate 10 minutes from subscription time
  const delayedTime = new Date(subscriptionTime.getTime() + 10 * 60 * 1000);

  // Store scheduled email in database for processing
  const scheduledEmailData = {
    email,
    category,
    frequency,
    subscriptionTime,
    scheduledTime: delayedTime,
    type: 'first_newsletter',
    status: 'pending'
  };

  console.log(`Scheduled first newsletter for ${email} at ${delayedTime.toLocaleString()}`);
  return scheduledEmailData;
}

export async function scheduleRecurringEmails(email, category, frequency, subscriptionTime) {
  // Calculate next delivery time based on subscription time
  const subscriptionHour = subscriptionTime.getHours();
  const subscriptionMinute = subscriptionTime.getMinutes();

  let nextDeliveryTime = new Date(subscriptionTime);

  if (frequency === 'daily') {
    // Set to next day at the same time
    nextDeliveryTime.setDate(nextDeliveryTime.getDate() + 1);
  } else if (frequency === 'weekly') {
    // Set to next week at the same time
    nextDeliveryTime.setDate(nextDeliveryTime.getDate() + 7);
  }

  // Ensure time matches subscription time
  nextDeliveryTime.setHours(subscriptionHour, subscriptionMinute, 0, 0);

  const recurringEmailData = {
    email,
    category,
    frequency,
    subscriptionTime,
    nextDeliveryTime,
    type: 'recurring_newsletter',
    status: 'scheduled'
  };

  console.log(`Scheduled recurring ${frequency} newsletter for ${email} starting ${nextDeliveryTime.toLocaleString()}`);
  return recurringEmailData;
}