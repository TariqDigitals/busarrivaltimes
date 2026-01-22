import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BlogPost {
  slug: string;
  updated_at: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const baseUrl = "https://www.busarrivaltimes.com";
    const currentDate = new Date().toISOString().split("T")[0];

    const staticPages = [
      { loc: baseUrl, lastmod: currentDate, changefreq: "daily", priority: "1.0" },
      { loc: `${baseUrl}/about`, lastmod: currentDate, changefreq: "monthly", priority: "0.8" },
      { loc: `${baseUrl}/contact`, lastmod: currentDate, changefreq: "monthly", priority: "0.6" },
      { loc: `${baseUrl}/privacy`, lastmod: currentDate, changefreq: "monthly", priority: "0.5" },
      { loc: `${baseUrl}/terms`, lastmod: currentDate, changefreq: "monthly", priority: "0.5" },
      { loc: `${baseUrl}/blog`, lastmod: currentDate, changefreq: "daily", priority: "0.9" },
    ];

    const blogPages = (posts || []).map((post: BlogPost) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: new Date(post.updated_at).toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.7",
    }));

    const allPages = [...staticPages, ...blogPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
