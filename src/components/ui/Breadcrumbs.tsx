import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link 
        href="/" 
        className="flex items-center hover:text-black transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={item.href}>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-black">{item.label}</span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-black transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
