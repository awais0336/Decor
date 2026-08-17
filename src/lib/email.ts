import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils/helpers";

// Create a nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface CheckoutEmailPayload {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  totalAmount: number;
  cartItems: any[];
}

export async function sendCheckoutEmail(payload: CheckoutEmailPayload) {
  // Check if credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes("placeholder")) {

    return { success: true, simulated: true };
  }

  try {
    // Build plain text item list
    const itemsText = payload.cartItems.map(item => {
      return `- ${item.name} | Qty: ${item.quantity} | Price: ${formatPrice(item.rawPrice * item.quantity)}`;
    }).join("\n");

    // Build HTML item list using mystique-tech's exact table row styling
    const itemsHtml = payload.cartItems.map(item => {
      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: 500;">${formatPrice(item.rawPrice * item.quantity)}</td>
        </tr>
      `;
    }).join("");

    const adminPlainTextContent = `
${siteConfig.name}
--------------------------------------------------
New Order Request

Name: ${payload.firstName} ${payload.lastName}
Email: ${payload.email}
Phone: ${payload.phone}

Delivery Address:
${payload.address}
${payload.city}, ${payload.postalCode}

--------------------------------------------------
ITEMS
--------------------------------------------------
${itemsText}

--------------------------------------------------
Total Amount: ${formatPrice(payload.totalAmount)}
--------------------------------------------------

System Notification via ${siteConfig.name} Storefront
© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.
`.trim();

    const adminHtmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
  <h2 style="color: #D4951B; margin-top: 0; text-align: center;">${siteConfig.name}</h2>
  
  <div style="background-color: #fdf8f3; border-radius: 6px; padding: 15px; margin-bottom: 25px; text-align: center;">
    <h3 style="margin: 0; color: #D4951B; font-size: 20px;">New Order Request</h3>
  </div>
  
  <p style="font-size: 16px;"><strong>Customer:</strong> ${payload.firstName} ${payload.lastName}</p>
  <p style="font-size: 16px; color: #444444;"><strong>Email:</strong> ${payload.email} <br> <strong>Phone:</strong> ${payload.phone}</p>
  
  <h4 style="margin-top: 35px; margin-bottom: 15px; border-bottom: 2px solid #f0e8dd; padding-bottom: 8px; font-size: 16px; color: #D4951B;">Delivery Details</h4>
  <p style="font-size: 15px; color: #444444; background-color: #fdf8f3; padding: 15px; border-radius: 6px;">
    <strong>${payload.address}</strong><br/>
    ${payload.city}, ${payload.postalCode}
  </p>
  
  <h4 style="margin-top: 35px; margin-bottom: 10px; border-bottom: 2px solid #f0e8dd; padding-bottom: 8px; font-size: 16px; color: #D4951B;">Order Items</h4>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 15px;">
    <thead>
      <tr>
        <th style="text-align: left; padding: 10px 0; border-bottom: 2px solid #eaeaea; color: #666;">Item</th>
        <th style="text-align: center; padding: 10px 0; border-bottom: 2px solid #eaeaea; color: #666;">Qty</th>
        <th style="text-align: right; padding: 10px 0; border-bottom: 2px solid #eaeaea; color: #666;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>
  
  <div style="text-align: right; font-size: 18px; margin-top: 20px; padding-top: 15px;">
    <strong>Total: <span style="color: #D4951B;">${formatPrice(payload.totalAmount)}</span></strong>
  </div>
  
  <div style="margin-top: 45px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 13px; color: #777777; text-align: center;">
    <p>System Notification via ${siteConfig.name} Storefront</p>
    <p style="margin-top: 15px;">© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
  </div>
</div>
`.trim();

    const customerPlainTextContent = `
${siteConfig.name}
--------------------------------------------------
Order Request Received

Hi ${payload.firstName},

Thank you so much for choosing ${siteConfig.name}! We have successfully received your request.

--------------------------------------------------
DELIVERY DETAILS
--------------------------------------------------
${payload.address}
${payload.city}, ${payload.postalCode}

--------------------------------------------------
ITEMS
--------------------------------------------------
${itemsText}

--------------------------------------------------
Total Amount: ${formatPrice(payload.totalAmount)}
--------------------------------------------------

Our team will contact you shortly to confirm the final delivery details. If you have any questions before then, please feel free to reply directly to this email.

Need help? Contact our support team at ${siteConfig.contactEmail}

© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.
`.trim();

    const customerHtmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
  <h2 style="color: #D4951B; margin-top: 0; text-align: center;">${siteConfig.name}</h2>
  
  <div style="background-color: #fdf8f3; border-radius: 6px; padding: 15px; margin-bottom: 25px; text-align: center;">
    <h3 style="margin: 0; color: #D4951B; font-size: 20px;">Order Request Received</h3>
  </div>
  
  <p style="font-size: 16px;">Hi <strong>${payload.firstName}</strong>,</p>
  <p style="font-size: 16px; color: #444444;">Thank you so much for choosing ${siteConfig.name}! We have successfully received your request and our team will contact you shortly to confirm the final delivery details.</p>
  
  <h4 style="margin-top: 35px; margin-bottom: 15px; border-bottom: 2px solid #f0e8dd; padding-bottom: 8px; font-size: 16px; color: #D4951B;">Delivery Details</h4>
  <p style="font-size: 15px; color: #444444; background-color: #fdf8f3; padding: 15px; border-radius: 6px;">
    <strong>${payload.address}</strong><br/>
    ${payload.city}, ${payload.postalCode}
  </p>
  
  <h4 style="margin-top: 35px; margin-bottom: 10px; border-bottom: 2px solid #f0e8dd; padding-bottom: 8px; font-size: 16px; color: #D4951B;">Order Items</h4>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 15px;">
    <thead>
      <tr>
        <th style="text-align: left; padding: 10px 0; border-bottom: 2px solid #eaeaea; color: #666;">Item</th>
        <th style="text-align: center; padding: 10px 0; border-bottom: 2px solid #eaeaea; color: #666;">Qty</th>
        <th style="text-align: right; padding: 10px 0; border-bottom: 2px solid #eaeaea; color: #666;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>
  
  <div style="text-align: right; font-size: 18px; margin-top: 20px; padding-top: 15px;">
    <strong>Total: <span style="color: #D4951B;">${formatPrice(payload.totalAmount)}</span></strong>
  </div>
  
  <div style="margin-top: 45px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 13px; color: #777777; text-align: center;">
    <p>Need help? Contact our support team at <br><a href="mailto:${siteConfig.contactEmail}" style="color: #D4951B; text-decoration: none; font-weight: bold;">${siteConfig.contactEmail}</a></p>
    <p style="margin-top: 15px;">© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
  </div>
</div>
`.trim();

    const adminMailOptions = {
      from: `"${siteConfig.name} Store" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: payload.email,
      subject: `New Order Request - ${payload.firstName} ${payload.lastName}`,
      text: adminPlainTextContent,
      html: adminHtmlContent
    };

    const customerMailOptions = {
      from: `"${siteConfig.name}" <${process.env.EMAIL_USER}>`,
      to: payload.email,
      subject: `Order Request Received - ${siteConfig.name}`,
      text: customerPlainTextContent,
      html: customerHtmlContent
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);


    return { success: true };
  } catch (err: any) {
    console.error("[Email Service] Failed to send email:", err);
    return { success: false, error: err.message || "Internal email service error" };
  }
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes("placeholder")) {

    return { success: true, simulated: true };
  }

  try {
    const adminPlainTextContent = `
${siteConfig.name}
--------------------------------------------------
New Contact Inquiry

Name: ${payload.name}
Email: ${payload.email}

Message:
${payload.message}
--------------------------------------------------
System Notification via ${siteConfig.name} Storefront
`.trim();

    const adminHtmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
  <h2 style="color: #D4951B; margin-top: 0; text-align: center;">${siteConfig.name}</h2>
  
  <div style="background-color: #fdf8f3; border-radius: 6px; padding: 15px; margin-bottom: 25px; text-align: center;">
    <h3 style="margin: 0; color: #D4951B; font-size: 20px;">New Contact Inquiry</h3>
  </div>
  
  <p style="font-size: 16px;"><strong>Name:</strong> ${payload.name}</p>
  <p style="font-size: 16px;"><strong>Email:</strong> ${payload.email}</p>
  
  <h4 style="margin-top: 35px; margin-bottom: 15px; border-bottom: 2px solid #f0e8dd; padding-bottom: 8px; font-size: 16px; color: #D4951B;">Message</h4>
  <p style="font-size: 15px; color: #444444; background-color: #fdf8f3; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${payload.message}</p>
  
  <div style="margin-top: 45px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 13px; color: #777777; text-align: center;">
    <p>System Notification via ${siteConfig.name} Storefront</p>
    <p style="margin-top: 15px;">© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
  </div>
</div>
`.trim();

    const customerPlainTextContent = `
${siteConfig.name}
--------------------------------------------------
Contact Inquiry Received

Hi ${payload.name},

We've received your message and our team will review your inquiry and get back to you within 24 hours.

Your Message:
${payload.message}
--------------------------------------------------
If you have any immediate details to add, feel free to reply directly to this email!

Need help? Contact our support team at ${siteConfig.contactEmail}

© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.
`.trim();

    const customerHtmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
  <h2 style="color: #D4951B; margin-top: 0; text-align: center;">${siteConfig.name}</h2>
  
  <div style="background-color: #fdf8f3; border-radius: 6px; padding: 15px; margin-bottom: 25px; text-align: center;">
    <h3 style="margin: 0; color: #D4951B; font-size: 20px;">Inquiry Received</h3>
  </div>
  
  <p style="font-size: 16px;">Hi <strong>${payload.name}</strong>,</p>
  <p style="font-size: 16px; color: #444444;">We've received your message and our team will review your inquiry and get back to you within 24 hours.</p>
  
  <h4 style="margin-top: 35px; margin-bottom: 15px; border-bottom: 2px solid #f0e8dd; padding-bottom: 8px; font-size: 16px; color: #D4951B;">Your Message</h4>
  <p style="font-size: 15px; color: #444444; background-color: #fdf8f3; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${payload.message}</p>
  
  <p style="font-size: 16px; margin-top: 25px;">If you have any immediate details to add, feel free to reply directly to this email!</p>
  
  <div style="margin-top: 45px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 13px; color: #777777; text-align: center;">
    <p>Need help? Contact our support team at <br><a href="mailto:${siteConfig.contactEmail}" style="color: #D4951B; text-decoration: none; font-weight: bold;">${siteConfig.contactEmail}</a></p>
    <p style="margin-top: 15px;">© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</p>
  </div>
</div>
`.trim();

    const teamMailOptions = {
      from: `"${siteConfig.name} Support" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: payload.email,
      subject: `Contact Inquiry: ${payload.name}`,
      text: adminPlainTextContent,
      html: adminHtmlContent
    };

    const clientMailOptions = {
      from: `"${siteConfig.name}" <${process.env.EMAIL_USER}>`,
      to: payload.email,
      subject: `We received your message - ${siteConfig.name}`,
      text: customerPlainTextContent,
      html: customerHtmlContent
    };

    await transporter.sendMail(teamMailOptions);
    await transporter.sendMail(clientMailOptions);


    return { success: true };
  } catch (err: any) {
    console.error("[Email Service] Failed to send email:", err);
    return { success: false, error: err.message || "Internal email service error" };
  }
}
