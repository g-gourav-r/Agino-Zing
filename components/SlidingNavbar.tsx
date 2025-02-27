"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronDown } from "@tabler/icons-react";
import { Navbar } from "./Navbar";

export function SlidingNavbar() {
  const [open, setOpen] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Close navbar if click outside when open.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Notch - Always visible */}
      <div className="flex justify-center">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center justify-center w-12 h-6 bg-gray-800 rounded-b-md shadow-md"
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <IconChevronDown className="text-white h-5 w-5" />
          </motion.div>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={navbarRef}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <Navbar />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
