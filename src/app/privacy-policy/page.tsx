import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Decornish",
  description: "Privacy Policy for Decornish.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-primary">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-brand-text">
        <h1 className="font-heading text-4xl mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 font-sans text-brand-text/80 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">1. Introduction</h2>
          <p>
            Welcome to Decornish. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">2. The Data We Collect About You</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us (including cart/order data).</li>
            <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
          </ul>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">3. How Is Your Personal Data Collected?</h2>
          <p>
            We use different methods to collect data from and about you including through direct interactions. You may give us your Identity and Contact Data by filling in forms (such as checkout and account signup) or by corresponding with us by post, phone, email or otherwise.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">4. How We Use Your Personal Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling your order).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          </ul>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">5. Data Storage and Security</h2>
          <p>
            We securely store your data using industry-standard cloud database infrastructure provided by Supabase. We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">6. Your Legal Rights (Data Deletion)</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data. This includes the right to request erasure of your personal data. If you wish to delete your account and personal data, you can do so through the &quot;Request Data Deletion&quot; option in your Account Settings, or by contacting us directly.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">7. Third-Party Links</h2>
          <p>
            This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">8. Contact Details</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at Decornish.pk@gmail.com.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
