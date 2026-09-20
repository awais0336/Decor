import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Decornish",
  description: "Refund and Return Policy for Decornish.",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-primary">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full text-brand-text">
        <h1 className="font-heading text-4xl mb-8">Refund & Return Policy</h1>
        
        <div className="space-y-6 font-sans text-brand-text/80 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">1. Returns</h2>
          <p>
            We have a 14-day return policy, which means you have 14 days after receiving your item to request a return.
          </p>
          <p>
            To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">2. Damages and Issues</h2>
          <p>
            Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">3. Non-returnable Items</h2>
          <p>
            Certain types of items cannot be returned, like custom products (such as special orders or personalized items) and sale items. Please get in touch if you have questions or concerns about your specific item.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">4. Exchanges</h2>
          <p>
            The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
          </p>

          <h2 className="font-heading text-2xl mt-8 mb-4 text-brand-text">5. Refunds</h2>
          <p>
            We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
