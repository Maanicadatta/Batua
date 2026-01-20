import React, { useEffect, useMemo, useRef } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

export default function StockChart({ candles }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const formatted = useMemo(() => {
    return (candles || [])
      .map((c) => {
        let t = c.time;

        // epoch ms → seconds
        if (typeof t === "number") {
          t = t > 1e12 ? Math.floor(t / 1000) : t;
        }

        // ISO → YYYY-MM-DD
        if (typeof t === "string" && t.includes("T")) {
          t = t.slice(0, 10);
        }

        if (!t) return null;

        return {
          time: t,
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        };
      })
      .filter(Boolean);
  }, [candles]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: Math.max(containerRef.current.clientWidth, 300),
      height: 260,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#111827",
      },
      grid: {
        vertLines: { color: "#EEF2FF" },
        horzLines: { color: "#EEF2FF" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#E5E7EB" },
      timeScale: { borderColor: "#E5E7EB", timeVisible: true },
    });

    const series = chart.addCandlestickSeries({
      upColor: "#16a34a",
      downColor: "#ef4444",
      borderUpColor: "#16a34a",
      borderDownColor: "#ef4444",
      wickUpColor: "#16a34a",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const resize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({
        width: Math.max(containerRef.current.clientWidth, 300),
      });
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(formatted);
    chartRef.current?.timeScale().fitContent();
  }, [formatted]);

  return <div ref={containerRef} style={{ width: "100%" }} />;
}
