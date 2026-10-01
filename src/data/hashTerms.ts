export type HashTerm = {
  id: string;
  term: string;
  definition: string;
};

/**
 * Plain-language glossary of Hash terminology, shown inside an Accordion so a
 * first-time visitor can decode the tradition without leaving the page.
 */
export const hashTerms: readonly HashTerm[] = [
  {
    id: "term-hare",
    term: "Hare",
    definition:
      "The member who plans, lays and marks the trail for the Pack. A Hare is responsible for choosing a safe, interesting route and briefing everyone before the run.",
  },
  {
    id: "term-pack",
    term: "Pack",
    definition:
      "Everyone taking part in a run — runners and walkers together. The Pack regroups throughout the trail and finishes as one group.",
  },
  {
    id: "term-circle",
    term: "Circle",
    definition:
      "The gathering that follows a run, when the fellowship shares stories, humour and recognition. The Circle is where much of the friendship happens.",
  },
  {
    id: "term-on-on",
    term: "On-On",
    definition:
      "The rallying call used by Hashers worldwide to greet one another, on the trail and at the Circle. It is WWH3's rallying call.",
  },
  {
    id: "term-down-down",
    term: "Down-Down",
    definition:
      "A friendly, exaggerated downfall of celebration, performed for a member to acknowledge them. Down-Downs are a great deal of theatre and very little dignity.",
  },
  {
    id: "term-virgin",
    term: "Virgin",
    definition:
      "A new member taking part in their first run. Virgins are traditionally given a Down-Down at the Circle to welcome them in.",
  },
  {
    id: "term-hash-name",
    term: "Hash Name",
    definition:
      "A nickname given to a member, usually reflecting their character, their running, or something memorable from a past trail.",
  },
] as const;
