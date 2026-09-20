import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Decornish",
  description: "Cookie Policy for Decornish.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-primary">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-brand-text">
        <h1 className="font-heading text-4xl mb-8">Cookie Policy</h1>
        
        <div className="space-y-6 font-sans text-brand-text/80 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">1. What are cookies?</h2>
          <p>
            Cookies are small pieces of data stored on your device (computer or mobile device). We use cookies and similar tracking technologies to track the activity on our service and hold certain information.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">2. How we use cookies</h2>
          <p>
            We only use essential cookies that are necessary for the website to function properly. These include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication Cookies:</strong> We use cookies to identify you when you visit our website and as you navigate our website (Supabase authentication).</li>
            <li><strong>Session Cookies:</strong> We use cookies to store information about your current session, such as keeping track of items in your shopping cart.</li>
            <li><strong>Consent Cookies:</strong> We use cookies to remember your preferences regarding the use of cookies on our website.</li>
          </ul>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">3. Third-party cookies</h2>
          <p>
            We do not use invasive third-party tracking cookies (such as advertising network trackers) on our storefront.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">4. Managing cookies</h2>
          <p>
            Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can however obtain up-to-date information about blocking and deleting cookies via your browser's support pages. Note that blocking all cookies will have a negative impact upon the usability of our website, and you will not be able to use the cart or login features.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
