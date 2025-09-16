import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrainCircuit, Globe2, BookOpenCheck, RocketIcon, Sparkles, Target, Users, TrendingUp, CheckCircle, ArrowRight, Star, Zap, Shield, Award } from "lucide-react";
import '../../App.css'


export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 text-slate-800 font-['Poppins']">


      {/* Simplified Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 border border-blue-200/50 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-slate-600 text-sm font-medium">Didukung Teknologi AI Terdepan</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Aicareer
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto mb-12 font-normal">
              Platform AI untuk mengakselerasi karir digital melalui 5 layanan: 
              <span className="text-blue-700 font-semibold"> Simulasi Kerja Real</span>, 
              <span className="text-blue-700 font-semibold"> Tes Teknis</span>, 
              <span className="text-blue-700 font-semibold"> Interview Practice</span>, 
              <span className="text-blue-700 font-semibold"> Jalur Karir</span>, dan
              <span className="text-blue-700 font-semibold"> Pengembangan Portfolio</span>
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
              <button className="bg-white/80 border border-blue-200/50 px-8 py-4 rounded-2xl text-lg font-medium w-full sm:w-auto transition-all duration-300 text-slate-700 hover:bg-white">
                Lihat Demo
              </button>
            </div>

           
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Pengguna Aktif" },
              { number: "95%", label: "Tingkat Sukses" },
              { number: "50+", label: "Model AI" },
              { number: "24/7", label: "Dukungan AI" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 border border-blue-200/50 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white">
                <div className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">{stat.number}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-32" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Fitur Unggulan
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              5 layanan AI untuk mengakselerasi karir digital Anda
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: RocketIcon,
                title: "Aimprove",
                subtitle: "Jalur Karir Personal",
                description: "Jalur karir yang dipersonalisasi untuk mengembangkan kemampuan teknis dan soft skill serta meningkatkan portofolio"
              },
              {
                icon: BookOpenCheck,
                title: "Aitest",
                subtitle: "Tes Kemampuan Teknis",
                description: "Simulasi tes teknis dan soft skill lengkap dengan rekomendasi peningkatan kemampuan"
              },
              {
                icon: Target,
                title: "Aiproject",
                subtitle: "Pengembangan Portofolio",
                description: "Menghubungkan talenta digital dengan proyek nyata dari UMKM dan komunitas untuk membangun portofolio"
              },
              {
                icon: BrainCircuit,
                title: "Aiwork",
                subtitle: "Simulasi Kerja Real",
                description: "Simulasi pengalaman kerja dengan kasus nyata untuk mengasah kemampuan dalam lingkungan yang aman"
              },
              {
                icon: Globe2,
                title: "Ainterview",
                subtitle: "Latihan Interview",
                description: "Simulasi interview dengan AI yang memberikan feedback langsung untuk persiapan karir yang lebih baik"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/80 border border-blue-200/50 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-sm text-blue-600/80 font-medium mb-3">{feature.subtitle}</p>
                <p className="text-slate-600 leading-relaxed text-sm">
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
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Cara Kerja
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              3 langkah mudah untuk memulai perjalanan karir digital Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Pilih Layanan",
                description: "Pilih salah satu dari 5 layanan AI kami sesuai kebutuhan karir Anda"
              },
              {
                step: "2", 
                title: "Ikuti Simulasi",
                description: "Ikuti simulasi interaktif yang dipersonalisasi untuk mengasah kemampuan Anda"
              },
              {
                step: "3",
                title: "Dapatkan Insight", 
                description: "Terima analisis mendalam dan rekomendasi untuk meningkatkan kemampuan Anda"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-blue-200/50 bg-white/80 flex items-center justify-center text-2xl font-bold mb-6 text-blue-700">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Harga Terjangkau
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Akses semua fitur premium dengan harga yang sangat terjangkau
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white border-2 border-blue-300/50 rounded-3xl p-8 text-center relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Paling Populer
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Premium Access</h3>
                <p className="text-slate-600 mb-6">Akses semua fitur AI Career</p>
                
                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-slate-800">24.900</span>
                  <span className="text-lg text-slate-600 ml-1">/ bulan</span>
                </div>
                
                {/* Features */}
                <div className="space-y-4 mb-8 text-left">
                  {[
                    "Akses ke semua 5 layanan AI",
                    "Simulasi kerja unlimited",
                    "Tes teknis dan soft skill",
                    "Interview practice dengan AI",
                    "Jalur karir personal",
                    "Pengembangan portfolio",
                    "Analisis mendalam & rekomendasi",
                    "Dukungan 24/7"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <button className="group relative w-full px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="relative z-10 flex items-center justify-center text-white">
                    <span>Mulai Berlangganan</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
                
                <p className="text-sm text-slate-500 mt-4">
                  *Gratis trial 7 hari, batalkan kapan saja
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 border border-blue-200/50 rounded-3xl p-8 md:p-12 lg:p-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-b from-slate-800 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Siap Mengakselerasi<br />Karir Digital Anda?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-12">
              Bergabunglah dengan ribuan profesional yang telah menggunakan Aicareer untuk mencapai karir impian mereka
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative px-8 py-4 rounded-2xl text-lg font-medium w-full sm:w-auto transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10 flex items-center justify-center text-white">
                  <span>Mulai Gratis Sekarang</span>
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </button>
              <button className="bg-white border border-blue-200/50 px-8 py-4 rounded-2xl text-lg font-medium w-full sm:w-auto transition-all duration-300 text-slate-700 hover:bg-slate-50">
                Lihat Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}