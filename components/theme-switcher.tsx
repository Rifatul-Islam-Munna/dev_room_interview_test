"use client";

import * as React from "react";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const themes = [
  {
    name: "Light",
    value: "light",
    color: "bg-white",
    textColor: "text-gray-900",
  },
  {
    name: "Dark",
    value: "dark",
    color: "bg-gray-900",
    textColor: "text-white",
  },
  {
    name: "Blue",
    value: "blue",
    color: "bg-blue-600",
    textColor: "text-white",
  },
  {
    name: "Purple",
    value: "purple",
    color: "bg-purple-600",
    textColor: "text-white",
  },
  {
    name: "Green",
    value: "green",
    color: "bg-green-600",
    textColor: "text-white",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
        <Palette className="h-4 w-4" />
        <span className="text-sm">Theme</span>
      </Button>
    );
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <div className={`h-4 w-4 rounded-full ${currentTheme.color}`} />
          <span className="text-sm flex-1 text-left">{currentTheme.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${t.color} border`} />
              <span>{t.name}</span>
            </div>
            {theme === t.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
