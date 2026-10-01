export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * WWH3 public FAQ.
 *
 * These answers are written for the website only. The separate Freetown Hash
 * Rules document is deliberately NOT reproduced here — it is a governing
 * document for Hash runners generally and is not ours to republish.
 */
export const faqItems: readonly FaqItem[] = [
  {
    id: "faq-what-is-hashing",
    question: "What is Hashing?",
    answer:
      "Hashing is a tradition that began with the British Military Hash House Harriers. A member known as the Hare lays a trail for the rest of the Pack to follow. Runners and walkers trace the marks, calling On-On when they find the correct route. The Pack gathers afterwards for a Circle of humour, recognition and fellowship.",
  },
  {
    id: "faq-is-it-a-race",
    question: "Is WWH3 a race?",
    answer:
      "No. WWH3 is a non-competitive social running fellowship. There are no timings, no placing and no pressure to be quick. The only measure of a good run is whether the whole Pack arrived together.",
  },
  {
    id: "faq-beginners",
    question: "Are beginners welcome?",
    answer:
      "Yes. Guests and first-time Hashers are welcome at every run. You do not need any previous experience, and you will never be left behind on your first trail.",
  },
  {
    id: "faq-walking",
    question: "Can someone walk?",
    answer:
      "Absolutely. Walkers are as valued as runners and take part fully — including the Circle afterwards. If walking the full route is not possible, simply say so and a Hare will arrange a suitable option.",
  },
  {
    id: "faq-what-to-wear",
    question: "What should participants wear?",
    answer:
      "Wear ordinary running or walking clothing suitable for the terrain and weather. Trail shoes are helpful on rough ground but are not compulsory. Anything reflecting your Hash number is always welcome.",
  },
  {
    id: "faq-what-to-bring",
    question: "What should participants bring?",
    answer:
      "Bring water, a small snack if you need one, and any medication you normally need. Sunscreen, a light rain layer and a phone are sensible for Freetown conditions. The Hare will always brief the Pack before setting off.",
  },
  {
    id: "faq-how-often",
    question: "How often does WWH3 run?",
    answer:
      "Regular Hash runs are held fortnightly on Fridays, with additional Friday and special runs announced when required. Contact WWH3 for the latest meeting point and starting time.",
  },
  {
    id: "faq-alcohol",
    question: "Is alcohol compulsory?",
    answer:
      "No. Alcohol is entirely optional. Non-alcoholic alternatives must always be provided at the Circle, and nobody is ever expected or pressured to drink.",
  },
  {
    id: "faq-membership",
    question: "How does membership work?",
    answer:
      "Attend a Hash as a guest, complete three runs, receive an endorsement from an existing member, and have your application reviewed by WWH3. Approved members pay the applicable fees and are then formally welcomed into the fellowship. An application does not guarantee membership.",
  },
  {
    id: "faq-contact",
    question: "How can someone contact WWH3?",
    answer:
      "Email westwesth3@gmail.com or call +232 31 251240. We will be glad to hear from anyone who wants to join, visit a run or ask a question about hashing.",
  },
] as const;
