import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Decornish",
  description: "Terms of Service for Decornish.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-primary">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-brand-text">
        <h1 className="font-heading text-4xl mb-8">Terms of Service</h1>
        
        <div className="space-y-6 font-sans text-brand-text/80 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">1. Agreement to Terms</h2>
          <p>
            By accessing or using the Decornish website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">2. Products and Services</h2>
          <p>
            We strive to display our products as accurately as possible. However, we cannot guarantee that your device's display of any color will be accurate. All descriptions of products and product pricing are subject to change at anytime without notice.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">3. Orders and Payments</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. Prices for our products are subject to change without notice.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">4. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">5. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of Decornish and its licensors.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">6. Limitation of Liability</h2>
          <p>
            In no event shall Decornish, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
