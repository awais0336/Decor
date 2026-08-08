import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getStoreSettings } from "@/lib/actions/storefront";

export async function Footer() {
  const settings = await getStoreSettings();
  return (
    <footer className="relative bg-brand-primary overflow-hidden text-brand-text pt-32 pb-12 px-6 md:px-12 border-t border-brand-text/10">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-text/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-20 items-start">

          {/* Brand & Description (Left) */}
          <div className="lg:col-span-5">
            <h2 className="font-heading text-4xl md:text-5xl tracking-tight uppercase mb-6 text-brand-text">
              Decornish
            </h2>
            <p className="font-sans text-brand-text/70 text-sm leading-relaxed mb-8 max-w-sm">
              Curating the art of living. Exclusive home decor, luxury furniture, and curated accessories for the modern home. Elevate your space with timeless elegance.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a 
                href={settings?.instagram_url || "#"} 
                className="group relative w-10 h-10 rounded-full border border-brand-text/20 flex items-center justify-center overflow-hidden hover:border-brand-gold transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-brand-gold translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <svg className="w-4 h-4 relative z-10 group-hover:text-brand-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook */}
              <a 
                href={settings?.facebook_url || "#"} 
                className="group relative w-10 h-10 rounded-full border border-brand-text/20 flex items-center justify-center overflow-hidden hover:border-brand-gold transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-brand-gold translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <svg className="w-4 h-4 relative z-10 group-hover:text-brand-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Middle (Quick Links) */}
          <div className="lg:col-span-3 flex flex-col pt-5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-brand-text/80">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-brand-text/60">
              <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
              <li><Link href="/collections" className="hover:text-brand-gold transition-colors">Collections</Link></li>
              <li><Link href="/wishlist" className="hover:text-brand-gold transition-colors">Wishlist</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Right Side (Newsletter & Contact) */}
          <div className="lg:col-span-4 flex flex-col gap-12 lg:gap-16">
            
            {/* Newsletter */}
            <div className="flex flex-col max-w-sm">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-brand-text/80">
                Join our private list
              </h3>
              <p className="font-sans text-brand-text/50 text-xs leading-relaxed mb-6">
                Subscribe to receive updates on new arrivals, access to exclusive deals, and interior design inspiration.
              </p>
              <form className="flex group border-b border-brand-text/20 focus-within:border-brand-gold transition-colors pb-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-transparent w-full py-2 outline-none text-sm text-brand-text placeholder:text-brand-text/30"
                />
                <button type="submit" className="p-2 text-brand-text/50 group-hover:text-brand-gold transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Contact */}
            <div className="flex flex-col w-64">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-brand-text/80">
                Contact
              </h3>
              <ul className="space-y-4 text-sm text-brand-text/60">
                <li>
                  <a href={`mailto:${settings?.contact_email || 'Decornish.pk@gmail.com'}`} className="hover:text-brand-gold transition-colors flex items-center gap-2 group">
                    <span className="w-6 h-6 rounded-full border border-brand-text/20 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </span>
                    <span>{settings?.contact_email || 'Decornish.pk@gmail.com'}</span>
                  </a>
                </li>
                <li className="leading-relaxed">
                  {settings?.address ? (
                    <span dangerouslySetInnerHTML={{ __html: settings.address.replace(/\n/g, '<br />') }} />
                  ) : (
                    <>
                      Ichara Punjab<br />
                      Lahore, Pakistan
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Decorative Giant Text */}
        <div className="w-full overflow-hidden flex justify-center items-center pointer-events-none opacity-[0.03] select-none mb-8">
          <span className="font-heading text-[12vw] leading-none tracking-tighter whitespace-nowrap">
            DECORNISH
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-text/10 font-sans text-brand-text/50 text-xs">
          <p>&copy; {new Date().getFullYear()} Decornish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
