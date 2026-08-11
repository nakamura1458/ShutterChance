export const EVENT_PLANS = {
  free: {
    name: "FREE",
    price: 0,
    maxUploadCount: 30,
    retentionDays: 7,
  },

  standard: {
    name: "STANDARD",
    price: 2490,
    maxUploadCount: 300,
    retentionDays: 30,
  },

  plus: {
    name: "PLUS",
    price: 4980,
    maxUploadCount: 1000,
    retentionDays: 90,
  },
} as const;

export type EventPlan = keyof typeof EVENT_PLANS;