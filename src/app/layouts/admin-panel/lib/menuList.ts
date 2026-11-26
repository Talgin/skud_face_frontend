import {
  Building,
  Camera,
  LayoutGrid,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Monitor,
  UserCog,
  Users,
} from "lucide-react";
import { type AccessReq, can, type Roles } from "@/entities/role";

import { t } from "@/shared/i18n";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  required?: AccessReq;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  required?: AccessReq;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

function filterByAccess(groups: Group[], roles: Roles[] | Roles): Group[] {
  const filtered = groups.map((g) => ({
    ...g,
    menus: g.menus
      .filter((m) => can(roles, m.required))
      .map((m) => ({
        ...m,
        submenus: m.submenus
          ? m.submenus.filter((s) => can(roles, s.required))
          : undefined,
      }))
      .filter((m) => !!m.href || (m.submenus && m.submenus.length > 0)),
  }));
  return filtered.filter((g) => g.menus.length > 0);
}

export function getMenuList(roles: Roles[] | Roles): Group[] {
  const groups: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: t("Мониторинг"),
          icon: Monitor,
          required: {
            anyOf: [
              "monitoring.view",
              "monitoring-history.view",
              "search.view",
            ],
          },
          submenus: [
            {
              href: "/monitoring/journal",
              label: t("Журнал видеоаналитики"),
              required: { anyOf: ["monitoring.view"] },
            },
            {
              href: "/monitoring",
              label: t("Мониторинг"),
              required: { anyOf: ["monitoring.view"] },
            },
            {
              href: "/monitoring/history",
              label: t("История"),
              required: { anyOf: ["monitoring-history.view"] },
            },
            {
              href: "/monitoring/search",
              label: t("Поиск по внешности"),
              required: { anyOf: ["search.view"] },
            },
          ],
        },
        {
          href: "/chat",
          label: t("Ассистент"),
          icon: MessageSquare,
          required: { anyOf: ["chat.use"] },
          submenus: [],
        },
        {
          href: "/dashboard",
          label: t("Дашборд"),
          icon: LayoutGrid,
          required: { anyOf: ["dashboard.view"] },
          submenus: [],
        },
      ],
    },
    {
      groupLabel: t("Формы"),
      menus: [
        {
          href: "",
          label: t("Организации"),
          icon: Building,
          required: { anyOf: ["org.view", "org.create"] },
          submenus: [
            {
              href: "/organization",
              label: t("Все организации"),
              required: { anyOf: ["org.view"] },
            },
            {
              href: "/organization/add",
              label: t("Добавить"),
              required: { anyOf: ["org.create"] },
            },
          ],
        },
        {
          href: "",
          label: t("Админы"),
          icon: UserCog,
          required: { anyOf: ["admin.view", "admin.create"] },
          submenus: [
            {
              href: "/admin",
              label: t("Все админы"),
              required: { anyOf: ["admin.view"] },
            },
            {
              href: "/admin/add",
              label: t("Добавить"),
              required: { anyOf: ["admin.create"] },
            },
          ],
        },
        {
          href: "/",
          label: t("База лиц"),
          icon: Users,
          required: { anyOf: ["user.view", "user.create", "user.batchCreate"] },
          submenus: [
            {
              href: "/faces",
              label: t("Все люди в базе"),
              required: { anyOf: ["user.view"] },
            },
            {
              href: "/faces/add",
              label: t("Добавить человека"),
              required: { anyOf: ["user.create"] },
            },
            {
              href: "/faces/import",
              label: t("Импорт из Excel"),
              required: { anyOf: ["user.batchCreate"] },
            },
          ],
        },
        {
          href: "/point",
          label: t("Точки"),
          icon: MapPin,
          required: { anyOf: ["point.view", "point.create"] },
          submenus: [
            {
              href: "/point",
              label: t("Все точки"),
              required: { anyOf: ["point.view"] },
            },
            {
              href: "/point/add",
              label: t("Добавить точку"),
              required: { anyOf: ["point.create"] },
            },
          ],
        },
        {
          href: "/camera",
          label: t("Камеры"),
          icon: Camera,
          required: { anyOf: ["camera.view", "camera.create"] },
          submenus: [
            {
              href: "/camera",
              label: t("Все камеры"),
              required: { anyOf: ["camera.view"] },
            },
            {
              href: "/camera/add",
              label: t("Добавить камеру"),
              required: { anyOf: ["camera.create"] },
            },
          ],
        },
      ],
    },
  ];

  return filterByAccess(groups, roles);
}
