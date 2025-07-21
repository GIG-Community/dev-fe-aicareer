import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrainCircuit, Globe2, BookOpenCheck, RocketIcon, Sparkles, Target, Users, TrendingUp, CheckCircle, ArrowRight, Star, Zap, Shield, Award } from "lucide-react";
import '../../App.css'


export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 text-slate-800 font-['Poppins']">


      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="hero-grid" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100" />
        
        {/* Animated Network Nodes */}
        <div className="network-container">
          <div className="network-node node-1" />
          <div className="network-node node-2" />
          <div className="network-node node-3" />
          <div className="network-node node-4" />
          <div className="network-node node-5" />
          <div className="network-node node-6" />
          <div className="network-node node-7" />
          <div className="network-node node-8" />
          <div className="network-node node-9" />
          <div className="network-node node-10" />
          
          {/* Network Connections */}
          <div className="network-connection connection-1" />
          <div className="network-connection connection-2" />
          <div className="network-connection connection-3" />
          <div className="network-connection connection-4" />
          <div className="network-connection connection-5" />
          <div className="network-connection connection-6" />
          <div className="network-connection connection-7" />
          <div className="network-connection connection-8" />
        </div>
        
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-300/15 to-transparent rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
        
        {/* Additional Dynamic Elements */}
        <div className="absolute top-[10%] right-[30%] w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl animate-drift-1" />
        <div className="absolute bottom-[15%] left-[25%] w-48 h-48 bg-gradient-to-tl from-slate-300/20 to-transparent rounded-full blur-2xl animate-drift-2" />
        <div className="absolute top-[70%] right-[15%] w-24 h-24 bg-gradient-to-r from-blue-500/15 to-transparent rounded-full blur-xl animate-drift-3" />
        
        {/* Data Flow Lines */}
        <div className="data-flow-container">
          <div className="data-flow-line flow-1" />
          <div className="data-flow-line flow-2" />
          <div className="data-flow-line flow-3" />
          <div className="data-flow-dot dot-1" />
          <div className="data-flow-dot dot-2" />
          <div className="data-flow-dot dot-3" />
          <div className="data-flow-dot dot-4" />
        </div>
      </div>
      
      {/* Enhanced Floating Geometric Elements */}
      <div className="fixed top-20 right-[10%] w-6 h-6 border border-blue-200/40 rotate-45 animate-pulse hidden lg:block" />
      <div className="fixed top-[30%] left-[15%] w-4 h-4 bg-blue-300/20 rounded-full animate-glow hidden lg:block" />
      <div className="fixed bottom-[25%] right-[20%] w-8 h-8 border border-blue-200/30 rounded-full hidden lg:block animate-spin" style={{ animationDuration: '40s' }} />
      <div className="fixed top-[60%] left-[8%] w-3 h-3 bg-blue-400/30 rotate-45 animate-pulse hidden xl:block" />
      <div className="fixed bottom-[40%] left-[85%] w-5 h-5 border border-blue-200/25 rounded-full animate-glow hidden xl:block" />
      
      {/* Additional Futuristic Elements */}
      <div className="fixed top-[15%] left-[5%] w-2 h-2 bg-blue-500/40 rounded-full animate-twinkle hidden lg:block" />
      <div className="fixed top-[45%] right-[5%] w-3 h-3 border border-blue-300/30 rotate-45 animate-float hidden lg:block" />
      <div className="fixed bottom-[60%] left-[12%] w-1 h-1 bg-slate-400/50 rounded-full animate-twinkle hidden xl:block" />
      <div className="fixed top-[80%] right-[25%] w-4 h-4 border border-slate-300/20 rounded-full animate-drift-slow hidden lg:block" />
      <div className="fixed bottom-[10%] right-[40%] w-2 h-2 bg-blue-600/30 rotate-45 animate-pulse hidden xl:block" />
      
      {/* Animated Lines */}
      <div className="fixed top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/30 to-transparent animate-scan-line hidden lg:block" />
      <div className="fixed top-[65%] left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300/20 to-transparent animate-scan-line-reverse hidden lg:block" />
      
      {/* Floating Particles */}
      <div className="particles-container fixed inset-0 pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8 animate-float">
              <Sparkles className="w-4 h-4 text-blue-600/70" />
              <span className="text-slate-600 text-sm font-light tracking-wide">Powered by Advanced AI Technology</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Aicareer
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-600 leading-relaxed max-w-5xl mx-auto mb-12 font-light">
              Platform AI terdepan dengan 4 layanan unggulan untuk mengakselerasi karir digital Anda melalui 
              <span className="text-blue-700 font-medium"> Simulasi Real-World Cases</span>, 
              <span className="text-blue-700 font-medium"> Technical Assessment</span>, 
              <span className="text-blue-700 font-medium"> Multilingual Interview</span>, dan 
              <span className="text-blue-700 font-medium"> Personalized Career Pathway</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="group relative px-8 py-4 rounded-2xl text-lg font-medium w-full sm:w-auto transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 flex items-center justify-center text-white">
                  <span>Mulai Gratis Sekarang</span>
                  <RocketIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
              <button className="glass-card hover:glass-card-hover px-8 py-4 rounded-2xl text-lg font-medium w-full sm:w-auto transition-all duration-300 border border-blue-200/50 text-slate-700">
                Lihat Demo Live
              </button>
            </div>

           
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-20 max-w-5xl mx-auto">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "95%", label: "Success Rate" },
              { number: "50+", label: "AI Models" },
              { number: "24/7", label: "AI Support" }
            ].map((stat, index) => (
              <div key={index} className="glass-card hover:glass-card-hover rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 group">
                <div className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-blue-700 transition-colors text-slate-800">{stat.number}</div>
                <div className="text-slate-500 text-sm font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-32" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8">
              <Target className="w-4 h-4 text-blue-600/70" />
              <span className="text-slate-600 text-sm font-light tracking-wide">Core Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Fitur Unggulan
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
              Teknologi AI terdepan untuk mengoptimalkan perjalanan karir digital Anda dengan pendekatan yang personal dan terukur
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: RocketIcon,
                title: "Aimprove",
                subtitle: "Career Pathway",
                description: "Personalized Career Pathway yang didesain untuk membentuk hardskill dan softskill, serta meningkatkan portofolio project"
              },
              {
                icon: Globe2,
                title: "Ainterview",
                subtitle: "Multilingual Interview",
                description: "Simulasi interview multilingual secara interaktif dengan AI yang memberikan feedback real-time dan personal"
              },
              {
                icon: BookOpenCheck,
                title: "Aitest",
                subtitle: "Technical Assessment",
                description: "Simulasi pengujian teknis + business softskill dan rekomendasi peningkatan kapabilitas penilaian teknis yang komprehensif"
              },
              {
                icon: BrainCircuit,
                title: "Aiwork",
                subtitle: "Real-World Simulation",
                description: "Simulasi bekerja real world case berdasarkan personalized career pathway secara interaktif untuk pengalaman kerja yang autentik"
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card hover:glass-card-hover rounded-2xl p-6 lg:p-8 relative group transition-all duration-500 hover:scale-105 text-center">
                <div className="absolute -top-3 -left-3 w-6 h-6 border-2 border-blue-200/50 rounded-full bg-slate-50" />
                <feature.icon className="w-12 h-12 text-blue-600 mb-6 animate-float group-hover:scale-110 transition-transform duration-500 mx-auto" />
                <h3 className="text-xl lg:text-2xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-sm text-blue-600/80 font-medium mb-4">{feature.subtitle}</p>
                <p className="text-slate-600 leading-relaxed font-light text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Bagaimana Cara Kerjanya?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
              Proses sederhana dalam 3 langkah untuk mengakselerasi karir Anda dengan AI yang personal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Process connecting line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
            
            {[
              {
                step: "1",
                title: "Pilih AI Service",
                description: "Pilih salah satu dari 4 layanan AI kami: Aiwork untuk simulasi kerja, Aitest untuk assessment, Ainterview untuk interview, atau Aimprove untuk career pathway"
              },
              {
                step: "2", 
                title: "Mulai Simulasi Interaktif",
                description: "Ikuti simulasi real-world yang dipersonalisasi sesuai profil karir Anda dengan teknologi AI yang memberikan pengalaman autentik"
              },
              {
                step: "3",
                title: "Terima Insights & Recommendations", 
                description: "Dapatkan analisis mendalam, feedback personal, dan rekomendasi actionable untuk meningkatkan kemampuan dan portofolio Anda"
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-blue-200/50 glass-card flex items-center justify-center text-2xl font-bold mb-6 hover:glass-card-hover transition-all duration-300 text-blue-700">
                  {item.step}
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 border border-blue-200/40 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 border border-blue-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card mb-8">
                <RocketIcon className="w-4 h-4 text-blue-600/70" />
                <span className="text-slate-600 text-sm font-light tracking-wide">4 AI Services Ready to Accelerate Your Career</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  Siap Mengakselerasi<br />Karir Digital Anda?
                </span>
              </h2>
              
              <p className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto mb-12 font-light">
                Bergabunglah dengan ribuan profesional yang telah menggunakan Aicareer untuk mencapai karir impian mereka melalui simulasi real-world, assessment komprehensif, dan career pathway yang dipersonalisasi
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button className="group relative px-8 py-4 rounded-2xl text-lg font-medium w-full sm:w-auto transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="relative z-10 flex items-center justify-center text-white">
                    <span>Mulai Gratis Sekarang</span>
                    <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </button>
                <button className="glass-card hover:glass-card-hover px-8 py-4 rounded-2xl text-lg font-medium w-full sm:w-auto transition-all duration-300 border border-blue-200/50 text-slate-700">
                  Lihat Demo Live
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-6 text-slate-500 text-sm font-light">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400/60 rounded-full"></div>
                  <span>4 AI Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400/60 rounded-full"></div>
                  <span>Personalized Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400/60 rounded-full"></div>
                  <span>Real-World Cases</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}