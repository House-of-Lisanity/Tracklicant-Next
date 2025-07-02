// src/app/api/parse-job/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Fetch the page
    const response = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(response.data);

    // Extract title and company
    const metaTitle =
      $('meta[property="og:title"]').attr("content")?.trim() ?? "";
    const metaCompany = $('meta[property="og:site_name"]')
      .attr("content")
      ?.trim();
    const fallbackTitle = $("title").text().trim();
    const altHeading = $("h1, h2").first().text().trim();

    const rawTitle = metaTitle || fallbackTitle || altHeading;
    let jobTitle = rawTitle;
    let company = "Unknown";

    // Site-specific parsing
    if (url.includes("workable.com") && rawTitle.includes(" - ")) {
      const parts = rawTitle.split(" - ");
      if (parts.length >= 3) {
        jobTitle = parts.slice(0, -2).join(" - ").trim();
        company = parts[parts.length - 2].trim();
      }
    } else if (url.includes("greenhouse.io")) {
      jobTitle = rawTitle.replace(/\s+in\s+[A-Za-z\s]+(,[\sA-Za-z]+)?$/, "");
      const slug = new URL(url).pathname.split("/").filter(Boolean);
      if (slug.length >= 2) {
        company = slug[0].replace(/-/g, " ").trim();
      }
    } else {
      jobTitle = rawTitle.replace(/\s+in\s+[A-Za-z\s]+(,[\sA-Za-z]+)?$/, "");
      if (metaCompany) {
        company = metaCompany;
      } else if (rawTitle.includes("|")) {
        const parts = rawTitle.split("|");
        company = parts[1].trim();
      }
    }

    return NextResponse.json({ title: jobTitle, company });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
