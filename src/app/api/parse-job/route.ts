import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const response = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(response.data);

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

    const hostname = new URL(url).hostname;
    const pathname = new URL(url).pathname;

    // ===== Workable =====
    if (url.includes("workable.com") && rawTitle.includes(" - ")) {
      const parts = rawTitle.split(" - ");
      if (parts.length >= 3) {
        jobTitle = parts.slice(0, -2).join(" - ").trim();
        company = parts[parts.length - 2].trim();
      }

      // ===== Greenhouse =====
    } else if (hostname.includes("greenhouse.io")) {
      jobTitle = rawTitle.replace(/\s+in\s+[A-Za-z\s]+(,[\sA-Za-z]+)?$/, "");
      const slug = pathname.split("/").filter(Boolean);
      if (slug.length >= 2) {
        company = slug[0].replace(/-/g, " ").trim();
      }

      // ===== Workday =====
    } else if (hostname.includes("myworkdayjobs.com")) {
      const segments = pathname.split("/");
      const jobSegment =
        segments.find((s) => s.includes("--")) || segments.at(-1);
      jobTitle = jobSegment?.replace(/[-_]/g, " ").replace(/\.html$/, "") || "";
      company = hostname.split(".")[0]; // e.g., "nvidia"

      // ===== iCIMS =====
    } else if (hostname.includes("icims.com")) {
      const segments = pathname.split("/");
      const slugIndex = segments.findIndex((s) => s === "jobs");
      jobTitle =
        slugIndex !== -1
          ? segments[slugIndex + 2]?.replace(/-/g, " ") || ""
          : "";
      company = hostname.split(".")[0].replace(/^careers-/, "");

      // ===== Fallback =====
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
    return NextResponse.json({ error: errorMsg }, { status: 200 });
  }
}
