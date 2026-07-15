import {
  APP_NAME,
  APP_TAGLINE,
  RECYCLE_METHODS,
  RECYCLE_POINTS_PER_ITEM,
  ROLE_LABELS,
  USER_ROLES,
} from "../utils/constants";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Intent {
  keywords: string[];
  reply: () => string;
}

const rolesSentence = USER_ROLES.map((r) => ROLE_LABELS[r]).join(", ");
const methodsSentence = RECYCLE_METHODS.join(", ");

const INTENTS: Intent[] = [
  {
    keywords: ["hello", "hi", "hey", "start", "help"],
    reply: () =>
      `Hi! I'm the ${APP_NAME} assistant. Ask me about product passports, repairs, recycling, points, or how to get started.`,
  },
  {
    keywords: ["passport", "qr", "scan"],
    reply: () =>
      "Each registered product gets a Digital Product Passport — a public page with its details and a QR code. Open a product and scan or share its QR to view the passport at /passport/<id>.",
  },
  {
    keywords: ["recycle", "recycling", "dispose", "e-waste", "ewaste"],
    reply: () =>
      `To recycle a product, go to the Recycling page in your dashboard, pick an item and a method (${methodsSentence}), and submit. You earn ${RECYCLE_POINTS_PER_ITEM} green points once an item is processed.`,
  },
  {
    keywords: ["point", "points", "reward", "green"],
    reply: () =>
      `You earn ${RECYCLE_POINTS_PER_ITEM} green points for every product that is recycled and processed. Your total shows on the Recycling page and your client dashboard.`,
  },
  {
    keywords: ["repair", "fix", "broken", "service"],
    reply: () =>
      "Open the Repairs page in your dashboard, choose the product, describe the issue, and submit. You can track each request through pending, in progress, completed, or rejected.",
  },
  {
    keywords: ["register", "sign up", "signup", "account", "create"],
    reply: () =>
      `Click Register on the home page, then enter your name, email, a password (8+ characters with a letter and a number), and pick an account type: ${rolesSentence}.`,
  },
  {
    keywords: ["login", "log in", "sign in", "signin", "password"],
    reply: () =>
      "Use the Login page with your email and password. Forgot it? Use the 'Forgot password?' link to get a reset email.",
  },
  {
    keywords: ["role", "roles", "admin", "industry", "client"],
    reply: () =>
      `${APP_NAME} has three roles: ${rolesSentence}. Clients track and recycle their own products, industry partners manage repairs and fleets, and admins oversee the whole platform.`,
  },
  {
    keywords: ["about", "retrace", "re-trace", "who"],
    reply: () => `${APP_NAME} is a ${APP_TAGLINE}. ${describeCapabilities()}`,
  },
];

function describeCapabilities(): string {
  return "It lets you register products, generate scannable passports, request repairs, recycle responsibly, and earn green points.";
}

const FALLBACK = `I'm not sure about that yet, but I can help with product passports, repairs, recycling, points, roles, and getting started with ${APP_NAME}.`;

/**
 * Returns the assistant's reply for a user message using lightweight
 * keyword-intent matching. Pure and deterministic so it can be unit tested.
 */
export function getAssistantReply(message: string): string {
  const text = message.trim().toLowerCase();
  if (!text) {
    return `Ask me anything about ${APP_NAME} — for example, "How do I recycle a product?"`;
  }

  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    const score = intent.keywords.reduce(
      (acc, kw) => (text.includes(kw) ? acc + kw.length : acc),
      0,
    );
    if (score > 0 && (!best || score > best.score)) {
      best = { intent, score };
    }
  }

  return best ? best.intent.reply() : FALLBACK;
}

export const assistant = { getReply: getAssistantReply };
