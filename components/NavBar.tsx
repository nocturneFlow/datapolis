"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Hexagon, Menu, X } from "lucide-react";
import { useMediaQuery } from "../hooks/use-mobile";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavLink = ({ href, label, isActive }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`relative px-3 py-2 transition-all duration-300 ${
        isActive
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-primary"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
      )}
    </Link>
  );
};

const NavBar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Navigation links
  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/renovation", label: "Реновация" },
    { href: "/survey", label: "Опрос" },
    { href: "/faqs", label: "FAQs" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-transparent backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <Hexagon className="w-6 h-6 text-primary" />
          <span>Datapolis</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}
          </nav>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              // variant="ghost"
              className="hidden md:inline-flex"
            >
              Войти
            </Button>
          </Link>
          {/* <Button>Get Started</Button> */}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && mobileMenuOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-md p-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="outline" className="w-full mt-2">
              Log In
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
