import { BrainCircuit, Globe2, BookOpenCheck, RocketIcon, Sparkles, Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { createElement } from "react";

export default function Footer() {
  const aiServices = [
    { name: "Aimprove", icon: RocketIcon, description: "Career Pathway" },
    { name: "Ainterview", icon: Globe2, description: "Multilingual Interview" },
    { name: "Aitest", icon: BookOpenCheck, description: "Technical Assessment" },
    { name: "Aiwork", icon: BrainCircuit, description: "Real-World Simulation" },
  ];

  const companyLinks = [
    { name: "About Us", href: "#about" },
    { name: "Our Story", href: "#story" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" },
    { name: "Contact", href: "#contact" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "#help" },
    { name: "Documentation", href: "#docs" },
    { name: "API Reference", href: "#api" },
    { name: "Community", href: "#community" },
    { name: "Status", href: "#status" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "GDPR", href: "#gdpr" },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#twitter" },
    { name: "LinkedIn", icon: Linkedin, href: "#linkedin" },
    { name: "GitHub", icon: Github, href: "#github" },
    { name: "Instagram", icon: Instagram, href: "#instagram" },
  ];

  return createElement('footer', { className: "relative py-12 bg-slate-50/80 backdrop-blur-sm border-t border-blue-200/30" },
    createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      createElement('div', { className: "relative" },
        createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12" },
          // Brand Section
          createElement('div', { className: "lg:col-span-2" },
            createElement('div', { className: "flex items-center space-x-3 mb-6" },
              createElement('div', { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center" },
                createElement(Sparkles, { className: "w-6 h-6 text-white" })
              ),
              createElement('span', { className: "text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent" }, "Aicareer")
            ),
            
            createElement('p', { className: "text-slate-600 leading-relaxed mb-6 max-w-md" },
              "Platform AI terdepan untuk mengakselerasi karir digital Anda dengan 4 layanan unggulan yang dipersonalisasi dan terukur."
            ),

            // AI Services Grid
            createElement('div', { className: "grid grid-cols-2 gap-3 mb-6" },
              ...aiServices.map((service, index) =>
                createElement('div', { key: index, className: "flex items-center space-x-2 p-3 rounded-xl bg-white/50 border border-blue-200/30 cursor-pointer" },
                  createElement(service.icon, { className: "w-4 h-4 text-blue-600" }),
                  createElement('div', null,
                    createElement('div', { className: "text-sm font-semibold text-slate-800" }, service.name),
                    createElement('div', { className: "text-xs text-slate-500" }, service.description)
                  )
                )
              )
            ),

            // Contact Info
            createElement('div', { className: "space-y-2" },
              createElement('div', { className: "flex items-center space-x-3 text-slate-600" },
                createElement(Mail, { className: "w-4 h-4 text-blue-500" }),
                createElement('span', { className: "text-sm" }, "hello@aicareer.com")
              ),
              createElement('div', { className: "flex items-center space-x-3 text-slate-600" },
                createElement(Phone, { className: "w-4 h-4 text-blue-500" }),
                createElement('span', { className: "text-sm" }, "+62 21 1234 5678")
              ),
              createElement('div', { className: "flex items-center space-x-3 text-slate-600" },
                createElement(MapPin, { className: "w-4 h-4 text-blue-500" }),
                createElement('span', { className: "text-sm" }, "Jakarta, Indonesia")
              )
            )
          ),

          // Company Links
          createElement('div', null,
            createElement('h3', { className: "text-lg font-semibold text-slate-800 mb-6" }, "Company"),
            createElement('ul', { className: "space-y-3" },
              ...companyLinks.map((link, index) =>
                createElement('li', { key: index },
                  createElement('a', { href: link.href, className: "text-slate-600 hover:text-blue-700 text-sm transition-colors duration-300" }, link.name)
                )
              )
            )
          ),

          // Support Links
          createElement('div', null,
            createElement('h3', { className: "text-lg font-semibold text-slate-800 mb-6" }, "Support"),
            createElement('ul', { className: "space-y-3" },
              ...supportLinks.map((link, index) =>
                createElement('li', { key: index },
                  createElement('a', { href: link.href, className: "text-slate-600 hover:text-blue-700 text-sm transition-colors duration-300" }, link.name)
                )
              )
            )
          ),

          // Legal Links
          createElement('div', null,
            createElement('h3', { className: "text-lg font-semibold text-slate-800 mb-6" }, "Legal"),
            createElement('ul', { className: "space-y-3" },
              ...legalLinks.map((link, index) =>
                createElement('li', { key: index },
                  createElement('a', { href: link.href, className: "text-slate-600 hover:text-blue-700 text-sm transition-colors duration-300" }, link.name)
                )
              )
            )
          )
        ),

        // Bottom Section with Social Links
        createElement('div', { className: "mt-8 pt-6 border-t border-blue-200/30 flex justify-center" },
          createElement('div', { className: "flex items-center space-x-4" },
            ...socialLinks.map((social, index) =>
              createElement('a', { 
                key: index, 
                href: social.href, 
                className: "w-8 h-8 rounded-lg bg-white/50 border border-blue-200/30 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300" 
              },
                createElement(social.icon, { className: "w-4 h-4" })
              )
            )
          )
        )
      )
    )
  );
}