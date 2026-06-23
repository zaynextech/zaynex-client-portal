type IconName =
  | "dashboard"
  | "clients"
  | "projects"
  | "files"
  | "invoices"
  | "support"
  | "analytics"
  | "settings"
  | "trash"
  | "bell"
  | "mail"
  | "star"
  | "briefcase";

export interface NavItem {
  title: string;
  url: string;
  icon: IconName;
}