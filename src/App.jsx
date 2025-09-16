import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css'
import Navbar from './components/navbar';
import Footer from './components/footer';

export default function App() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 text-slate-800 font-['Poppins']">
      {/* Navbar */}
      {/* <Navbar /> */}

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
        
        {/* ...existing background elements... */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-300/15 to-transparent rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
        
        {/* ...existing decorative elements... */}
      </div>
      
      {/* ...existing floating elements... */}

      {/* Main Content Area - This is where pages will render */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
