// /pages/api/checkAvailability.ts
import { load } from "cheerio";

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  // Extract date from query parameters
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing required query parameter: date" });
  }

  const url = 'https://shrikashivishwanath.org/frontend/dashboard/chkavailbilty';
  const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'base_url=https%3A%2F%2Fshrikashivishwanath.org%2F; ci_session=4ki4ltm8rsh3ur0j8lalkgmgnb98s09t',
  };

  const body = new URLSearchParams({
    is_family_price: '1',
    pooja_darshan: '37',
    select_date: date,
    nop: '1',
    nocc: '',
  });

  try {
    // Make a POST request to the external URL
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    // Parse the response HTML
    const html = await response.text();
    const $ = load(html);
    const button = $('#btnBook');

    if (button.length === 0) {
      return res.status(404).json({ status: "not available" });
    }

    const buttonText = button.text().trim().toLowerCase();
    if (buttonText === "not available") {
      return res.status(200).json({ status: "not available" });
    } else {
      return res.status(200).json({ status: "available" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
}
