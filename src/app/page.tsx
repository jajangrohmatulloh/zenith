'use client';

import React, { useState } from 'react';
import { HomeTemplate } from "@/presentation/components/templates/HomeTemplate";

import { useAuth } from "@/presentation/context/auth-context";
import { LoginView } from "@/presentation/components/organisms/LoginView";

export default function Home() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user && showLogin) {
    return <LoginView onBack={() => setShowLogin(false)} />;
  }

  return <HomeTemplate onLoginToggle={() => setShowLogin(true)} />;
}



