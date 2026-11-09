/**
 * Rule-based Bengali phonological normalizer for TTS synthesis.
 *
 * Applies ONLY to the spoken text sent to `/api/tts` (the printed text on the
 * page remains completely untouched):
 * 1. Composes decomposed Unicode nukta sequences (`য+়` -> `য়`, `ড+়` -> `ড়`, `ঢ+়` -> `ঢ়`)
 *    so the TTS G2P tokenizer never confuses `য+়` with ja-phala (`্য`).
 * 2. Preserves the inherent medial vowel (`ো`) on unmarked middle consonants
 *    immediately preceding `য় + vowel/consonant` (`অভয়া` -> `অভোয়া`, `অবয়ব` -> `অবোয়ব`,
 *    `হৃদয়ের` -> `হৃদোয়ের`, `সময়ের` -> `সমোয়ের`, `ক্ষয়িত` -> `ক্ষোয়িত`, `উন্নয়নের` -> `উন্নোয়নের`),
 *    preventing colloquial medial schwa deletion (*মধ্য স্বরলোপ*).
 * 3. Enforces standard Bengali open-o (*ও-কারান্ত*) pronunciation on past-tense verbs
 *    in `-ল` and `-ছিল` (`পেল` -> `পেলো`, `গেল` -> `গেলো`, `ছিল` -> `ছিলো`, `করেছিল` -> `করেছিলো`).
 * 4. Preserves open-o pronunciation on past habitual verbs in `-ত` (`পেত` -> `পেতো`, `হত` -> `হতো`)
 *    and indefinite pronouns/adverbs (`কত` -> `কতো`, `এত` -> `এতো`, `যত` -> `যতো`, `মতই` -> `মতোই`).
 * 5. Restores natural open [æ] vowel pronunciation on initial `ব্য-` words (`ব্যথা` -> `ব্যাথা`).
 * 6. Smooths internal bisarga (`ঃ`) gemination and sacred/epic conjuncts (`ব্রহ্মাস্ত্র` -> `ব্রম্ভাস্ত্র`).
 */

const MEDIAL_YA_VOWEL_RULE =
  /([\u0985-\u0994\u0995-\u09b9\u09dc\u09dd\u09df][\u09be-\u09cc\u09cd\u0981-\u0983]*)([\u0995-\u09b9])(\u09df(?:[\u09be\u09bf\u09c0\u09c7\u09cb]|[\u0995-\u09b9]))/g;

const VERB_FINAL_O_RULE =
  /(^|[^\u0980-\u09ff])(পেল|গেল|দিল|হল|খেল|এল|নিল|বলল|করল|চলল|দেখল|শুনল|পড়ল|পড়ল|বসল|উঠল|নামল|থাকল|লাগল|পারল|ঝরল)(?=[^\u0980-\u09ff]|$)/g;

const PAST_CHILO_RULE =
  /(^|[^\u0980-\u09ff])(\S*ছিল)(?=[^\u0980-\u09ff]|$)/g;

const HABITUAL_VERB_RULE =
  /(^|[^\u0980-\u09ff])(পেত|হত)(?=[^\u0980-\u09ff]|$)/g;

const INHERENT_O_WORDS_RULE =
  /(^|[^\u0980-\u09ff])(কত|এত|যত)(?=[^\u0980-\u09ff]|$)/g;

const OPEN_AE_BYA_WORDS_RULE =
  /(^|[^\u0980-\u09ff])(ব্যথা|ব্যস্ততম|ব্যস্ততা|ব্যস্ত|ব্যবধান)(?=[^\u0980-\u09ff]|$)/g;

const BYA_WORD_MAP: Record<string, string> = {
  ব্যথা: "ব্যাথা",
  ব্যস্ততম: "ব্যাস্ততম",
  ব্যস্ততা: "ব্যাস্ততা",
  ব্যস্ত: "ব্যাস্ত",
  ব্যবধান: "ব্যাবধান",
};

const SPECIAL_PHONETIC_REPLACEMENTS: [RegExp, string][] = [
  [/মতই/g, "মতোই"],
  [/(^|\s)ওঁ(?=\s|[।,?!]|$)/g, "$1ওম"],
  [/অন্তঃসলিলার/g, "অন্তসলিলার"],
  [/অন্তঃসলিলা/g, "অন্তসলিলা"],
  [/নিঃশব্দে/g, "নিশশব্দে"],
  [/নিঃশব্দ/g, "নিশশব্দ"],
  [/নিঃসঙ্গ/g, "নিশসঙ্গ"],
  [/নিঃশ্বাস/g, "নিশশ্বাস"],
  [/দুঃসহ/g, "দুশসহ"],
  [/দুঃখের/g, "দুকখের"],
  [/দুঃখ/g, "দুকখ"],
  [/ব্রহ্মাস্ত্র/g, "ব্রম্ভাস্ত্র"],
  [/অপরাহ্ণের/g, "অপরাহ্নর"],
];

export function composeBengaliNuktas(input: string): string {
  return input
    .replace(/\u09af\u09bc/g, "\u09df") // য + ় -> য়
    .replace(/\u09a1\u09bc/g, "\u09dc") // ড + ় -> ড়
    .replace(/\u09a2\u09bc/g, "\u09dd"); // ঢ + ় -> ঢ়
}

export function normalizeBengaliForTts(raw: string): string {
  let text = composeBengaliNuktas(raw);

  text = text.replace(MEDIAL_YA_VOWEL_RULE, "$1$2\u09cb$3");
  text = text.replace(VERB_FINAL_O_RULE, "$1$2\u09cb");
  text = text.replace(PAST_CHILO_RULE, "$1$2\u09cb");
  text = text.replace(HABITUAL_VERB_RULE, "$1$2\u09cb");
  text = text.replace(INHERENT_O_WORDS_RULE, "$1$2\u09cb");
  text = text.replace(
    OPEN_AE_BYA_WORDS_RULE,
    (_, prefix, word) => `${prefix}${BYA_WORD_MAP[word] || word}`
  );

  for (const [pattern, replacement] of SPECIAL_PHONETIC_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }

  return text;
}
