"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, LayoutDashboard, Trophy, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/scenarios",
      label: "Scenarios",
      icon: Terminal,
    },
    {
      href: "/achievements",
      label: "Achievements",
      icon: Trophy,
    },
  ];

  return (
    <nav className="border-b border-border/20 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-cyan transition-all duration-300 group-hover:scale-110">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              K8sTroubleshoot
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`
                      relative px-4 py-2 transition-all duration-300
                      ${isActive 
                        ? "text-cyan-400" 
                        : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-cyan-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                    DU
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-border/20" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Demo User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    demo@k8stshoot.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/20" />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
