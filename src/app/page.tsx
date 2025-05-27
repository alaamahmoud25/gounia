import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return <div>
    <div className="w-100 flex gap-x-5 justify-end">
         <UserButton/>
      <ThemeToggle />
      
      </div>



    <h1 className="text-3xl font-bold font-barlow text-blue-600">Welcome to Gounia</h1>
    <Button>Welcome</Button>
  </div>
  
}
