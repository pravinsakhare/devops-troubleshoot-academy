"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, LayoutDashboard, Trophy, User, LogOut, Settings, HelpCircle, Bell, Search, Home } from "lucide-react";
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
  const router = useRouter();

  // Home click handler - navigates to home page
  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Home clicked from:', pathname);
    
    // If already on home page, scroll to top
    if (pathname === '/') {
      console.log('Already on home page, scrolling to top');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Navigate to home page
    try {
      router.push('/');
      console.log('Attempted router.push("/")');
      
      // Fallback: If router doesn't work after 100ms, force reload
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          console.log('Router failed, forcing window.location');
          window.location.href = '/';
        }
      }, 100);
    } catch (error) {
      // Fallback to direct navigation
      console.error('Router failed:', error);
      window.location.href = '/';
    }
  };

  // Logo click handler - same as home click
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleHomeClick(e);
  };

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isButton: true,
      onClick: handleHomeClick,
    },
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
    <nav className="border-b border-cyan-500/10 bg-[#0a0e1a]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            onClick={handleLogoClick}
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-cyan"
            >
              <Terminal className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hidden sm:block">
              K8sTroubleshoot
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
              
              if (item.isButton) {
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    onClick={item.onClick}
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
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" 
                      />
                    )}
                  </Button>
                );
              }
              
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
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" 
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            {/* Home - Navigate to Main Landing Page */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHomeClick}
              className="text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
              title="Go to Homepage"
            >
              <Home className="w-5 h-5" />
            </Button>

            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-colors">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold text-sm">
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
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                
                if (item.isButton) {
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      size="icon"
                      onClick={item.onClick}
                      className={isActive ? "text-cyan-400" : "text-muted-foreground"}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  );
                }
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={isActive ? "text-cyan-400" : "text-muted-foreground"}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}