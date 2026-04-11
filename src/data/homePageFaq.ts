import { BUSINESS_AREA_SERVED } from "../lib/business";

/** שאלות נפוצות בדף הבית, תואמות לסכמת FAQPage */
export const HOME_PAGE_FAQ_ITEMS: readonly { question: string; answer: string }[] = [
  {
    question: "איך מזמינים?",
    answer: "ניתן להזמין בקלות דרך וואטסאפ בלחיצה על הכפתור באתר.",
  },
  {
    question: "האם יש משלוחים כל יום?",
    answer: "כן, אנו מספקים אספקה יומית בהתאם לזמינות.",
  },
  {
    question: "לאיזה אזורים אתם מגיעים?",
    answer: `אנו מספקים שירות ב${BUSINESS_AREA_SERVED}`,
  },
];
