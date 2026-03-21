"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, AreaSeries } from "lightweight-charts";
import type { IChartApi } from "lightweight-charts";

interface DataPoint {
  date: string;
  total_value: number;
}

interface PortfolioChartProps {
  data: DataPoint[];
  height?: number;
}

export function PortfolioChart({ data, height = 200 }: PortfolioChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [crosshairValue, setCrosshairValue] = useState<{ time: string; value: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8B8B9E",
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(255,255,255,0.03)" },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        horzLine: { color: "rgba(59,130,246,0.3)" },
        vertLine: { color: "rgba(59,130,246,0.3)" },
      },
      handleScroll: { mouseWheel: false, pressedMouseMove: false },
      handleScale: false,
    });

    const isPositive = data.length > 1 ? data[data.length - 1].total_value >= data[0].total_value : true;
    const lineColor = isPositive ? "#22C55E" : "#EF4444";

    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: `${lineColor}33`,
      bottomColor: "transparent",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBackgroundColor: lineColor,
    });

    const chartData = data.map((d) => ({
      time: d.date.split("T")[0],
      value: d.total_value,
    }));

    series.setData(chartData as Parameters<typeof series.setData>[0]);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData.size > 0) {
        const val = param.seriesData.get(series);
        if (val && "value" in val) {
          setCrosshairValue({ time: param.time as string, value: val.value });
        }
      } else {
        setCrosshairValue(null);
      }
    });

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-bg-surface rounded-[12px]" style={{ height }}>
        <span className="text-[14px] text-text-tertiary">No chart data yet</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {crosshairValue && (
        <div className="absolute top-2 left-3 z-10 bg-bg-surface/90 rounded px-2 py-1">
          <span className="text-[12px] text-text-secondary">{crosshairValue.time}</span>
          <span className="text-[14px] text-text-primary ml-2 font-medium tabular-nums">
            ${crosshairValue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}
      <div ref={containerRef} className="rounded-[12px] overflow-hidden" />
    </div>
  );
}
