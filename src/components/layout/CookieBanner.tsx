"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      // Small delay so it doesn't pop up immediately
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-brand-primary border border-brand-border shadow-2xl rounded-lg p-6 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <button 
              onClick={declineCookies} 
              className="absolute top-2 right-2 p-2 text-brand-text/50 hover:text-brand-text transition-colors rounded-full focus-visible:ring-2 focus-visible:ring-brand-gold focus:outline-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex-1 pr-6 md:pr-0">
              <h3 className="font-heading text-lg text-brand-text mb-2">We value your privacy</h3>
              <p className="font-sans text-brand-text/70 text-sm leading-relaxed">
                We use essential cookies to make our site work and to personalize your experience. We do not use third-party tracking cookies. Read our <Link href="/cookie-policy" className="text-brand-gold hover:underline focus-visible:ring-2 focus-visible:ring-brand-gold focus:outline-none rounded-sm">Cookie Policy</Link> for more information.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={declineCookies}
                className="flex-1 md:flex-none px-6 py-2.5 border-2 border-brand-border text-brand-text rounded-md font-button font-medium hover:bg-brand-secondary transition-colors focus-visible:ring-2 focus-visible:ring-brand-gold focus:outline-none"
              >
                Decline All
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 md:flex-none px-6 py-2.5 bg-brand-text text-white rounded-md font-button font-medium hover:bg-brand-gold transition-colors focus-visible:ring-2 focus-visible:ring-brand-gold focus:outline-none"
              >
                Accept Essential
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
