import React from 'react'
// Header
import Header from "@/components/dashboard/header/header";
// Sidebar
import Sidebar from "@/components/dashboard/sidebar/sidebar";

export default function adminDashboardLayout({
  children
}: {
  children: React.ReactNode
  }) {
  
  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <Sidebar isAdmin />
      <div className="ml-[300px]">
        {/* Header */}
        <Header />
          <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}

