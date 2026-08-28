import type { NavItem } from "@/types/navigation";

export const adminNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin/",
    icon: "dashboard",
  },
  {
    title: "Project Requests",
    url: "/admin/project-requests",
    icon: "projects",
  },
  {
    title: "Clients",
    url: "/admin/clients",
    icon: "clients",
  },
  {
    title: "Projects",
    url: "/admin/projects",
    icon: "projects",
  },
  {
    title: "Tasks",
    url: "/admin/tasks",
    icon: "briefcase",
  },
  {
    title: "Support",
    url: "/admin/support",
    icon: "support",
  },
  {
    title: "Files",
    url: "/admin/files",
    icon: "files",
  },
  {
    title: "Invoices",
    url: "/admin/invoices",
    icon: "invoices",
  },
  {
    title: "Emails",
    url: "/admin/emails",
    icon: "mail",
  },
  {
    title: "Reviews",
    url: "/admin/testimonials",
    icon: "star",
  },
  {
    title: "Portfolio",
    url: "/admin/portfolio",
    icon: "briefcase",
  },
  {
    title: "Deletion Requests",
    url: "/admin/account-deletion-requests",
    icon: "trash",
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: "analytics",
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: "bell",
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: "settings",
  },


  
];

export const developerNav = [
  {
    title: "Dashboard",
    url: "/developer/",
    icon: "dashboard",
  },
    {
  title: "Tasks",
  url: "/developer/tasks",
  icon: "briefcase",
},
  {
    title: "Projects",
    url: "/developer/projects",
    icon: "projects",
  },
  {
    title: "Support",
    url: "/developer/support",
    icon: "support",
  },
  {
    title: "Files",
    url: "/developer/files",
    icon: "files",
  },
  {
    title: "Notifications",
    url: "/developer/notifications",
    icon: "bell",
  },
  
] as const;