import { BrainCircuit, Globe2, BookOpenCheck, RocketIcon, Menu, X, Sparkles, ReceiptText } from "lucide-react";
import { useState, createElement } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Aimprove", icon: RocketIcon, href: "/aimprove" },
    { name: "Aiproject", icon: ReceiptText, href: "/aiproject" },
    { name: "Ainterview", icon: Globe2, href: "/ainterview" },
    { name: "Aitest", icon: BookOpenCheck, href: "/aitest" },
    { name: "Aiwork", icon: BrainCircuit, href: "/aiwork" },
  ];

  return createElement('div', null,
    // Desktop Navbar
    createElement('nav', { className: "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden lg:block" },
      createElement('div', { className: "glass-card px-6 py-4 rounded-2xl border border-blue-200/50 backdrop-blur-md" },
        createElement('div', { className: "flex items-center space-x-8" },
          // Logo
          createElement(Link, { to: "/", className: "flex items-center space-x-2" },
            createElement('div', { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center" },
              createElement(Sparkles, { className: "w-5 h-5 text-white" })
            ),
            createElement('span', { className: "text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent" }, "Aicareer")
          ),
          // Navigation Items
          createElement('div', { className: "flex items-center space-x-6" },
            ...navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return createElement(Link, {
                key: index,
                to: item.href,
                className: `group flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors duration-300 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 font-semibold' 
                    : 'text-slate-700 hover:text-blue-700'
                }`
              },
                createElement(item.icon, { className: `w-4 h-4 group-hover:scale-110 transition-transform ${isActive ? 'text-blue-700' : ''}` }),
                createElement('span', { className: "text-sm font-medium" }, item.name)
              )
            })
          ),
          // CTA Button
          createElement(Link, { 
            to: "/login",
            className: "px-6 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
          },
            "Get Started"
          )
        )
      )
    ),

    // Mobile Navbar
    createElement('nav', { className: "fixed top-4 left-4 right-4 z-50 lg:hidden" },
      createElement('div', { className: "glass-card px-4 py-3 rounded-2xl border border-blue-200/50" },
        createElement('div', { className: "flex items-center justify-between" },
          // Mobile Logo
          createElement(Link, { to: "/", className: "flex items-center space-x-2" },
            createElement('div', { className: "w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center" },
              createElement(Sparkles, { className: "w-4 h-4 text-white" })
            ),
            createElement('span', { className: "text-lg font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent" }, "Aicareer")
          ),
          // Mobile Menu Button
          createElement('button', {
            onClick: () => setIsOpen(!isOpen),
            className: "p-2 rounded-xl text-slate-700 hover:text-blue-700 transition-colors duration-300"
          },
            createElement(isOpen ? X : Menu, { className: "w-5 h-5" })
          )
        ),

        // Mobile Menu
        isOpen ? createElement('div', { className: "mt-4 pt-4 border-t border-blue-200/30" },
          createElement('div', { className: "space-y-2" },
            ...navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return createElement(Link, {
                key: index,
                to: item.href,
                className: `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-300 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 font-semibold' 
                    : 'text-slate-700 hover:text-blue-700'
                }`,
                onClick: () => setIsOpen(false)
              },
                createElement(item.icon, { className: `w-4 h-4 ${isActive ? 'text-blue-700' : ''}` }),
                createElement('span', { className: "text-sm font-medium" }, item.name)
              )
            }),
            createElement(Link, { 
              to: "/login",
              className: "w-full mt-4 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center block" 
            },
              "Get Started"
            )
          )
        ) : null
      )
    )
  );
}

