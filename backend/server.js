import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;
const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

// ---- helpers ----
function requireKey(res) {
  if (!TWELVE_DATA_API_KEY) {
    res.status(500).json({ error: "Missing TWELVE_DATA_API_KEY on server" });
    return false;
  }
  return true;
}

/**
 * GET /api/stocks/search?q=tesla
 * Returns global symbol matches
 */
app.get("/api/stocks/search", async (req, res) => {
  if (!requireKey(res)) return;

  const q = String(req.query.q || "").trim();
  if (q.length < 2) return res.json([]);

  try {
    const url = new URL("https://api.twelvedata.com/symbol_search");
    url.searchParams.set("symbol", q);
    url.searchParams.set("outputsize", "25");
    url.searchParams.set("apikey", TWELVE_DATA_API_KEY);

    const r = await fetch(url);
    const data = await r.json();

    // Twelve Data returns: { data: [...] } or error shape
    const rows = Array.isArray(data?.data) ? data.data : [];

    // Normalize for your frontend
    const normalized = rows.map((s) => ({
      company_name: s.instrument_name || s.name || s.symbol,
      ticker_symbol: s.symbol,
      exchange: s.exchange,
      mic_code: s.mic_code,
      country: s.country,
      currency: s.currency,
      instrument_type: s.instrument_type,
    }));

    res.json(normalized);
  } catch (e) {
    console.error("search error:", e);
    res.status(500).json({ error: "Search failed" });
  }
});

/**
 * GET /api/stocks/details?symbol=TSLA&exchange=NASDAQ
 * Returns quote + a simple about/profile
 */
app.get("/api/stocks/details", async (req, res) => {
  if (!requireKey(res)) return;

  const symbol = String(req.query.symbol || "").trim();
  const exchange = String(req.query.exchange || "").trim();

  if (!symbol) return res.status(400).json({ error: "Missing symbol" });

  try {
    // Quote
    const quoteUrl = new URL("https://api.twelvedata.com/quote");
    quoteUrl.searchParams.set("symbol", exchange ? `${symbol}:${exchange}` : symbol);
    quoteUrl.searchParams.set("apikey", TWELVE_DATA_API_KEY);

    const qr = await fetch(quoteUrl);
    const qd = await qr.json();

    // Profile (optional)
    const profUrl = new URL("https://api.twelvedata.com/profile");
    profUrl.searchParams.set("symbol", exchange ? `${symbol}:${exchange}` : symbol);
    profUrl.searchParams.set("apikey", TWELVE_DATA_API_KEY);

    const pr = await fetch(profUrl);
    const pd = await pr.json();

    // Normalize
    res.json({
      symbol,
      exchange: exchange || qd?.exchange || null,
      currency: qd?.currency || pd?.currency || null,

      last_price: qd?.close ?? qd?.price ?? "—",
      change: qd?.change ?? "—",
      change_pct: qd?.percent_change ?? "—",

      volume: qd?.volume ?? "—",
      open: qd?.open ?? "—",
      prev_close: qd?.previous_close ?? "—",
      day_low: qd?.low ?? "—",
      day_high: qd?.high ?? "—",

      about:
        pd?.description ||
        pd?.company_description ||
        "Company profile will appear here once you connect a fundamentals provider.",
    });
  } catch (e) {
    console.error("details error:", e);
    res.status(500).json({ error: "Details failed" });
  }
});

/**
 * GET /api/stocks/history?symbol=TSLA&exchange=NASDAQ&range=1y&interval=1day
 * Returns candles
 */
app.get("/api/stocks/history", async (req, res) => {
  if (!requireKey(res)) return;

  const symbol = String(req.query.symbol || "").trim();
  const exchange = String(req.query.exchange || "").trim();
  const interval = String(req.query.interval || "1day").trim();

  // For Twelve Data, we usually use "outputsize" rather than range. We'll approximate range by outputsize.
  const range = String(req.query.range || "1y").trim();

  if (!symbol) return res.status(400).json({ error: "Missing symbol" });

  const outputsizeByRange = {
    "1d": 80,
    "5d": 250,
    "1mo": 260,
    "3mo": 300,
    "6mo": 400,
    "ytd": 300,
    "1y": 400,
    "5y": 1200,
    "max": 5000,
  };

  const outputsize = outputsizeByRange[range] || 400;

  try {
    const url = new URL("https://api.twelvedata.com/time_series");
    url.searchParams.set("symbol", exchange ? `${symbol}:${exchange}` : symbol);
    url.searchParams.set("interval", interval);
    url.searchParams.set("outputsize", String(outputsize));
    url.searchParams.set("apikey", TWELVE_DATA_API_KEY);

    const r = await fetch(url);
    const data = await r.json();

    const values = Array.isArray(data?.values) ? data.values : [];

    // Convert to your chart format (candles)
    // Your StockChart likely expects [{ time, open, high, low, close, volume }]
    const candles = values
      .map((v) => ({
        time: v.datetime,
        open: Number(v.open),
        high: Number(v.high),
        low: Number(v.low),
        close: Number(v.close),
        volume: v.volume ? Number(v.volume) : null,
      }))
      .reverse(); // oldest -> newest

    res.json(candles);
  } catch (e) {
    console.error("history error:", e);
    res.status(500).json({ error: "History failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Stocks API running on :${PORT}`);
});
