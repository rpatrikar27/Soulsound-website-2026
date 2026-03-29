import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import { supabaseAdmin, supabaseServer } from "./src/lib/supabase.ts";
import { createRazorpayOrder, verifyPaymentSignature } from "./src/lib/razorpay.ts";
import { createShiprocketOrder } from "./src/lib/shiprocket.ts";
import { Resend } from "resend";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const resendApiKey = process.env.RESEND_API_KEY;
  const resend = resendApiKey ? new Resend(resendApiKey) : null;

  app.use(express.json());
  app.use(cookieParser());

  // --- API Routes ---

  // Razorpay Create Order
  app.post("/api/razorpay/create-order", async (req, res) => {
    try {
      const { amount, items, customer, shipping_address } = req.body;
      
      // Generate Order Number: SS-2026-XXXXX
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `SS-2026-${randomSuffix}`;

      // Create Razorpay Order
      const razorpayOrder = await createRazorpayOrder(amount, orderNumber);

      // Create Pending Order in Supabase
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          shipping_address,
          items,
          total_amount: amount,
          razorpay_order_id: razorpayOrder.id,
          payment_status: 'pending',
          fulfillment_status: 'unfulfilled'
        })
        .select()
        .single();

      if (error) throw error;

      res.json({
        razorpay_order_id: razorpayOrder.id,
        order_id: order.id,
        amount: razorpayOrder.amount
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Razorpay Verify Payment
  app.post("/api/razorpay/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

      const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

      if (!isValid) {
        return res.status(400).json({ success: false, message: "Invalid signature" });
      }

      // Update Order in Supabase
      const { data: order, error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'paid',
          razorpay_payment_id,
          razorpay_signature
        })
        .eq('id', order_id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Reduce Stock Quantity
      for (const item of order.items) {
        await supabaseAdmin.rpc('decrement_stock', { 
          product_id: item.id, 
          quantity: item.quantity 
        });
      }

      // Trigger Shiprocket Order Creation
      try {
        const shipment = await createShiprocketOrder(order);
        await supabaseAdmin
          .from('orders')
          .update({
            shiprocket_order_id: shipment.order_id,
            shiprocket_shipment_id: shipment.shipment_id,
            fulfillment_status: 'processing'
          })
          .eq('id', order_id);
      } catch (shipError) {
        console.error("Shiprocket creation failed, but payment was successful:", shipError);
      }

      res.json({ success: true, order_number: order.order_number });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Newsletter Subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) {
        if (error.code === '23505') {
          return res.json({ success: true, message: "Already subscribed" });
        }
        throw error;
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contact Form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      // 1. Save to Supabase
      const { error: dbError } = await supabaseAdmin
        .from('contact_submissions')
        .insert({ name, email, phone, subject, message });

      if (dbError) throw dbError;

      // 2. Send Email Notification
      if (resend) {
        await resend.emails.send({
          from: 'SoulSound <support@soulsound.in>',
          to: 'support@soulsound.in',
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
          `
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Disallow: /admin/
Disallow: /account/
Sitemap: https://soulsound.in/sitemap.xml`);
  });

  // Sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { data: products } = await supabaseAdmin.from('products').select('slug, updated_at').eq('is_active', true);
      const { data: blogs } = await supabaseAdmin.from('blogs').select('slug, updated_at').eq('is_published', true);
      
      const baseUrl = "https://soulsound.in";
      const categories = ['earbuds', 'headphones', 'neckbands'];
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>`;

      products?.forEach(p => {
        xml += `<url><loc>${baseUrl}/products/${p.slug}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod><priority>0.8</priority></url>`;
      });

      categories.forEach(c => {
        xml += `<url><loc>${baseUrl}/collections/${c}</loc><priority>0.8</priority></url>`;
      });

      blogs?.forEach(b => {
        xml += `<url><loc>${baseUrl}/blogs/${b.slug}</loc><lastmod>${new Date(b.updated_at).toISOString()}</lastmod><priority>0.6</priority></url>`;
      });

      xml += `</urlset>`;
      res.type("application/xml");
      res.send(xml);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });

  // --- Admin Middleware ---
  app.use("/admin/*", async (req, res, next) => {
    if (req.path === "/admin/login") return next();
    
    const supabase = supabaseServer({ req, res });
    if (!supabase) {
      console.warn("Supabase not configured. Admin access disabled.");
      return res.status(500).send("Admin access disabled: Supabase not configured.");
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return res.redirect("/admin/login");
    }
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
