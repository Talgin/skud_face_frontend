import type { AdminValues } from "../model/types";

export type AdminUpdateBody = {
  name: string;
  surname: string;
  card_id: string;
  role: AdminValues["role"];
  active: boolean;
  organization_id: number;
  username?: string;
  password?: string;
};

// PATCH body for editing an admin. Username/password are sent only when typed in,
// so saving other fields never overwrites the credentials.
export function buildAdminUpdateBody(values: AdminValues): AdminUpdateBody {
  const body: AdminUpdateBody = {
    name: values.name,
    surname: values.surname,
    card_id: values.cardId,
    role: values.role,
    active: values.isActive,
    organization_id: values.organizationId,
  };
  const username = values.username?.trim();
  if (username) body.username = username;
  if (values.password) body.password = values.password;
  return body;
}
