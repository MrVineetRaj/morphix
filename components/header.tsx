"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Clock, Bookmark, Upload, LayoutGrid } from "lucide-react";
import UploadModal from "./upload-modal";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useManageCredit } from "@/hooks/manage-credit";
import { getCredits } from "@/lib/api_calls/credits";
import { toast } from "sonner";

export default function Header() {
  const { credits, setCredits } = useManageCredit();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        if (!isSignedIn) return;
        const response = await getCredits(user.id);
        if (response) {
          setCredits(response.credits);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };

    fetchCredits();
  }, [user, isSignedIn]);

  return (
    <header className="p-2 sticky top-0 z-50 w-full border-b  flex items-center justify-center ">
      <div className="container flex h-16 items-center justify-between ">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-md bg-blue-600 p-1">
            <LayoutGrid className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Morphix</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <div className="cursor-pointer active:scale-95 transition-all">
              <SignInButton />
            </div>
            <div className="bg-primary text-white rounded-md px-4 py-2 cursor-pointer active:scale-95 transition-all">
              <SignUpButton />
            </div>
          </SignedOut>
          <SignedIn>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="flex gap-2">
                <Clock className="h-4 w-4" />
                <span>History</span>
              </Button>
            </Link>

            <span
              className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              onClick={() => {
                toast.warning("This feature is not available yet");
              }}
            >
              {credits} Credits Left
            </span>

            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              size="sm"
            >
              <Upload className="h-4 w-4" />
              <span>Upload New Video</span>
            </Button>

            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4 ">
          <SignedOut>
            <div className="cursor-pointer active:scale-95 transition-all">
              <SignInButton />
            </div>
            <div className="bg-primary text-white rounded-md px-4 py-2 cursor-pointer active:scale-95 transition-all">
              <SignUpButton />
            </div>
          </SignedOut>
          <SignedIn>
            <span
              className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
              onClick={() => {
                toast.warning("This feature is not available yet");
              }}
            >
              {credits} Credits
            </span>

            <UserButton />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Link
                    href="/history"
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                  >
                    <Clock className="h-5 w-5" />
                    <span>History</span>
                  </Link>

                  <Button
                    onClick={() => {
                      setIsUploadModalOpen(true);
                    }}
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white gap-2 p-2"
                    size="sm"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload New Video</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </SignedIn>
        </div>
      </div>

      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </header>
  );
}
