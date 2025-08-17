import {
  Building,
  Camera,
  LayoutGrid,
  type LucideIcon,
  MapPin,
  Monitor,
  Settings,
  UserCog,
  Users,
} from "lucide-react";
import { type AccessReq, can, type Roles } from "@/entities/role";

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
          href: "/monitoring",
          label: "Мониторинг",
          icon: Monitor,
          submenus: [],
        },
        {
          href: "/dashboard",
          label: "Дашборд",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Формы",
      menus: [
        {
          href: "",
          label: "Организации",
          icon: Building,
          required: { anyOf: ["org.view", "org.create"] },
          submenus: [
            {
              href: "/organization",
              label: "Все организаций",
              required: { anyOf: ["org.view"] },
            },
            {
              href: "/organization/add",
              label: "Добавить",
              required: { anyOf: ["org.create"] },
            },
          ],
        },
        {
          href: "",
          label: "Админы",
          icon: UserCog,
          required: { anyOf: ["admin.view", "admin.create"] },
          submenus: [
            {
              href: "/admin",
              label: "Все админы",
              required: { anyOf: ["admin.view"] },
            },
            {
              href: "/admin/add",
              label: "Добавить",
              required: { anyOf: ["admin.create"] },
            },
          ],
        },
        {
          href: "/",
          label: "Пользователи",
          icon: Users,
          required: { anyOf: ["user.view", "user.create", "user.batchCreate"] },
          submenus: [
            {
              href: "/user",
              label: "Все пользователи",
              required: { anyOf: ["user.view"] },
            },
            {
              href: "/user/add",
              label: "Добавить нового пользователя",
              required: { anyOf: ["user.create"] },
            },
            {
              href: "/user/add-batch",
              label: "Добавить пользователей",
              required: { anyOf: ["user.batchCreate"] },
            },
          ],
        },
        {
          href: "/point",
          label: "Точки",
          icon: MapPin,
          required: { anyOf: ["point.view", "point.create"] },
          submenus: [
            {
              href: "/point",
              label: "Все точки",
              required: { anyOf: ["point.view"] },
            },
            {
              href: "/point/add",
              label: "Добавить точку",
              required: { anyOf: ["point.create"] },
            },
          ],
        },
        {
          href: "/camera",
          label: "Камеры",
          icon: Camera,
          required: { anyOf: ["camera.view", "camera.create"] },
          submenus: [
            {
              href: "/camera",
              label: "Все камеры",
              required: { anyOf: ["camera.view"] },
            },
            {
              href: "/camera/add",
              label: "Добавить камеру",
              required: { anyOf: ["camera.create"] },
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/profile",
          label: "Личный кабинет",
          icon: Settings,
        },
      ],
    },
  ];

  return filterByAccess(groups, roles);
}
