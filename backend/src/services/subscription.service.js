const isSubscriptionActive = (subscription) => {
  if (!subscription) return false;
  if (subscription.status !== "active") return false;
  if (!subscription.endDate) return false;
  return new Date(subscription.endDate).getTime() > Date.now();
};

module.exports = {
  isSubscriptionActive,
};
