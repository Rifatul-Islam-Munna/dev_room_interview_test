"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  PieChart,
  Users,
  BarChart3,
  Settings,
  LifeBuoy,
  Send,
  Home,
  Receipt,
  DollarSign,
  Calendar,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const data = {
    user: {
      name: user?.fullName || "User",
      email: user?.primaryEmailAddress?.emailAddress || "",
      avatar: user?.imageUrl || "/avatars/default.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: <Home />,
        isActive: true,
      },
      {
        title: "Purchases",
        url: "/dashboard/purchases",
        icon: <CreditCard />,
        /*  items: [
          {
            title: "Purchases",
            url: "/dashboard/purchases",
          },
          {
            title: "Add new",
            url: "/dashboard/purchases/new",
          },
        ], */
      },
      {
        title: "Income",
        url: "/dashboard/income",
        icon: <TrendingUp />,
        /*   items: [
          {
            title: "All Income",
            url: "/income",
          },
          {
            title: "Add Income",
            url: "/income/new",
          },
          {
            title: "Categories",
            url: "/income/categories",
          },
        ], */
      },
      {
        title: "Shared Wallets",
        url: "/wallets",
        icon: <Users />,
        items: [
          {
            title: "My Wallets",
            url: "/wallets",
          },
          {
            title: "Create Wallet",
            url: "/wallets/new",
          },
          {
            title: "Invitations",
            url: "/wallets/invitations",
          },
        ],
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: <BarChart3 />,
        items: [
          {
            title: "Overview",
            url: "/analytics",
          },
          {
            title: "Spending Trends",
            url: "/analytics/spending",
          },
          {
            title: "Income Trends",
            url: "/analytics/income",
          },
          {
            title: "Reports",
            url: "/analytics/reports",
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: <Settings />,
        items: [
          {
            title: "Profile",
            url: "/settings/profile",
          },
          {
            title: "Categories",
            url: "/settings/categories",
          },
          {
            title: "Preferences",
            url: "/settings/preferences",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Personal Finance",
        url: "/projects/personal",
        icon: <Wallet />,
      },
      {
        name: "Monthly Budget",
        url: "/projects/budget",
        icon: <PieChart />,
      },
      {
        name: "Tax Planning",
        url: "/projects/tax",
        icon: <Receipt />,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "/support",
        icon: <LifeBuoy />,
      },
      {
        title: "Feedback",
        url: "/feedback",
        icon: <Send />,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-blue-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Wallet className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FinanceFlow</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Expense Tracker
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />

        <SidebarSeparator className="mx-0" />

        {/* Theme Switcher */}
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground px-2 pb-2">
            Appearance
          </p>
          <ThemeSwitcher />
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
