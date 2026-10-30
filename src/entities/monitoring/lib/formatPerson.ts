// Formatting of who was seen: the model's estimates (age, gender) for every face and,
// for a match against «База лиц», the person's registered details.

export interface PersonFields {
  is_known?: boolean | null;
  person_name?: string | null;
  person_surname?: string | null;
  person_age?: number | null;
  age?: number | null;
  gender?: string | null;
}

const DASH = "—";

// 1 год, 2 года, 5 лет, 11 лет, 21 год ...
export function yearsLabel(years: number): string {
  const n = Math.abs(Math.trunc(years));
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${n} лет`;
  if (last === 1) return `${n} год`;
  if (last >= 2 && last <= 4) return `${n} года`;
  return `${n} лет`;
}

// model estimate, e.g. "~39"
export function formatModelAge(age?: number | null): string {
  if (age === null || age === undefined || !Number.isFinite(age)) return DASH;
  return `~${Math.round(age)}`;
}

export function formatGender(gender?: string | null): string {
  if (gender === "male") return "мужчина";
  if (gender === "female") return "женщина";
  return DASH;
}

// full name of the matched enrolled person, or null when the face is unknown
export function personName(event: PersonFields): string | null {
  if (!event.is_known) return null;
  const name = [event.person_name, event.person_surname]
    .filter((part) => part?.trim())
    .join(" ");
  return name || null;
}

// registered age of the matched person, e.g. "36 лет"; null when unknown
export function registeredAge(event: PersonFields): string | null {
  if (!event.is_known) return null;
  const age = event.person_age;
  if (age === null || age === undefined || !Number.isFinite(age)) return null;
  return yearsLabel(age);
}
