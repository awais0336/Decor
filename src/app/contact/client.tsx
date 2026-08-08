"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-primary">
      
      <div className="flex-1 pt-40 md:pt-48 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl text-brand-text mb-4">Contact Us</h1>
          <p className="font-sans text-brand-text/70 max-w-2xl mx-auto">
            We're here to help. Whether you have a question about an order, our products, or interior design advice, our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Information */}
          <div className="space-y-12">
            <h2 className="font-heading text-3xl text-brand-text mb-8">Get in Touch</h2>
            
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-sans font-semibold text-brand-text mb-1 uppercase tracking-widest text-sm">Email</h3>
                <p className="text-brand-text/70">Decornish.pk@gmail.com</p>
                <p className="text-brand-text/50 text-sm mt-1">We aim to respond within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-sans font-semibold text-brand-text mb-1 uppercase tracking-widest text-sm">Phone</h3>
                <p className="text-brand-text/70">+92 3289111139</p>
                <p className="text-brand-text/50 text-sm mt-1">Mon-Fri, 9am - 6pm PKT</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-sans font-semibold text-brand-text mb-1 uppercase tracking-widest text-sm">Studio</h3>
                <p className="text-brand-text/70">
                  Ichara , Lahore<br />
                  Punjab , Pakistan<br />
                  54000
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-md shadow-sm border border-brand-border/20">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-brand-gold mb-6" />
                <h3 className="font-heading text-2xl text-brand-text mb-2">Message Sent!</h3>
                <p className="text-brand-text/70">
                  Thank you for reaching out. We have received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-sm font-semibold uppercase tracking-widest text-brand-text hover:text-brand-gold transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-brand-text/70 mb-2">
                    Name
                  </label>
                  <input 
                    required 
                    name="name" 
                    type="text" 
                    className="w-full border-b border-brand-border bg-transparent px-0 py-2 text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-brand-text/70 mb-2">
                    Email
                  </label>
                  <input 
                    required 
                    name="email" 
                    type="email" 
                    className="w-full border-b border-brand-border bg-transparent px-0 py-2 text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-brand-text/70 mb-2">
                    Message
                  </label>
                  <textarea 
                    required 
                    name="message" 
                    rows={4}
                    className="w-full border-b border-brand-border bg-transparent px-0 py-2 text-brand-text focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-text text-white py-4 rounded-md font-button font-semibold hover:bg-brand-gold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
