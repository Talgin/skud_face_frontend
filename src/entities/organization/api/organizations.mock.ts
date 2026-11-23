import type { OrganizationDto } from "./types";

// Placeholder data until the organizations API exists (see getOrganizations.ts).
export const organizationsMock: OrganizationDto[] = [1, 2, 3, 4].map((id) => ({
  id,
  name: `Организация ${id}`,
  ceo_name: "Name Surname",
  address: "Адрес не указан",
  phone: "",
}));
