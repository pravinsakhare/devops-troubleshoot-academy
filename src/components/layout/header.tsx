"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  LayoutDashboard,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  BookOpen,
  Code,
  Rocket,
  Shield,
  Layers,
  Settings,
  HelpCircle,
  FileText,
  Users,
  Sparkles,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const courseCategories = [
  {
    title: "Kubernetes Troubleshooting",
    description: "Debug pods, services, and deployments",
    icon: Layers,
    href: "/scenarios?category=kubernetes",
    color: "text-cyan-400",
  },
  {
    title: "Docker Issues",
    description: "Container debugging & optimization",
    icon: Code,
    href: "/scenarios?category=docker",
    color: "text-blue-400",
  },
  {
    title: "CI/CD Pipeline Problems",
    description: "Fix broken pipelines & deployments",
    icon: Rocket,
    href: "/scenarios?category=cicd",
    color: "text-purple-400",
  },
  {
    title: "Cloud Platform Issues",
    description: "AWS, GCP, Azure troubleshooting",
    icon: Shield,
    href: "/scenarios?category=cloud",
    color: "text-green-400",
  },
];

const quickLinks = [
  { title: "Documentation", href: "/docs", icon: FileText },
  { title: "Community Forum", href: "/community", icon: Users },
  { title: "Cheat Sheets", href: "/resources/cheatsheets", icon: BookOpen },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scenarios", label: "Scenarios", icon: Terminal },
    { href: "/achievements", label: "Achievements", icon: Trophy },
  ];

  // ULTIMATE LOGO CLICK HANDLER - Multiple fallback methods
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Logo clicked from:', pathname);
    
    // If already on home page, do nothing
    if (pathname === '/') {
      console.log('Already on home page');
      return;
    }
    
    // Method 1: Try Next.js router first
    try {
      router.push('/');
      console.log('Attempted router.push("/")');
      
      // Method 2: If router doesn't work after 100ms, force reload
      setTimeout(() => {
        if (window.location.pathname !== '/') {
          console.log('Router failed, forcing window.location');
          window.location.href = '/';
        }
      }, 100);
    } catch (error) {
      // Method 3: Fallback to direct navigation
      console.error('Router failed:', error);
      window.location.href = '/';
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-[60]">
        <motion.div
          className="h-full progress-gradient"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a0e1a]/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-14" : "h-16"
          }`}>
            {/* Logo with ultimate fix */}
            <a 
              href="/"
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group cursor-pointer"
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
            </a>

            <div className="hidden lg:flex items-center space-x-1">
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`px-4 py-2 flex items-center gap-1 transition-all duration-300 ${
                    isMegaMenuOpen ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Courses
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isMegaMenuOpen ? "rotate-180" : ""
                  }`} />
                </Button>

                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[700px]"
                    >
                      <div className="bg-card/95 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-black/30 overflow-hidden">
                        <div className="grid grid-cols-2 gap-0">
                          <div className="p-6 border-r border-cyan-500/10">
                            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4 flex items-center">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Popular Paths
                            </h3>
                            <div className="space-y-3">
                              {courseCategories.map((category) => (
                                <Link
                                  key={category.title}
                                  href={category.href}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-cyan-500/10 transition-all duration-200 group"
                                >
                                  <div className={`p-2 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 group-hover:scale-110 transition-transform ${category.color}`}>
                                    <category.icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground group-hover:text-cyan-400 transition-colors">
                                      {category.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {category.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="p-6">
                            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-4 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Resources
                            </h3>
                            <div className="space-y-2">
                              {quickLinks.map((link) => (
                                <Link
                                  key={link.title}
                                  href={link.href}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyan-500/10 transition-all duration-200 group"
                                >
                                  <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400" />
                                  <span className="text-muted-foreground group-hover:text-foreground">
                                    {link.title}
                                  </span>
                                </Link>
                              ))}
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                              <Badge className="mb-2 bg-cyan-500/20 text-cyan-400 border-none">
                                NEW
                              </Badge>
                              <h4 className="font-semibold mb-1">K8s Security Mastery</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                Learn to secure your clusters
                              </p>
                              <Button size="sm" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                                Start Free
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="px-6 py-3 bg-secondary/30 border-t border-cyan-500/10 flex items-center justify-between">
                          <Link
                            href="/scenarios"
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            View All Courses
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            500+ scenarios available
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`relative px-4 py-2 transition-all duration-300 ${
                        isActive ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsSearchOpen(true)}
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

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0a0e1a]/95 backdrop-blur-xl border-t border-cyan-500/10"
            >
              <div className="container mx-auto px-6 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-cyan-500/10">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-4">
                    Course Categories
                  </p>
                  {courseCategories.map((category) => (
                    <Link
                      key={category.title}
                      href={category.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                        <category.icon className={`w-4 h-4 ${category.color}`} />
                        <span className="text-sm">{category.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-24"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-cyan-500/10">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search 500+ troubleshooting scenarios..."
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                  <Badge variant="outline" className="text-xs">
                    ESC
                  </Badge>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["CrashLoopBackOff", "Service Discovery", "PVC Pending", "Ingress 503", "Node Pressure"].map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="cursor-pointer hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}