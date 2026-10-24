"use client";

import { memo, type ReactNode, useDeferredValue, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Row, TESTS, type Test } from "@/lib/benchmarks";

type Metric = "fps" | "allocated";
type View = "chart" | "table";

const OURS = "Courier";
const ROW_HEIGHT = 24;
const AXIS_BAND = 28;

const METRICS: { key: Metric; label: string; unit: string; higher: boolean }[] =
  [
    { key: "fps", label: "Frame rate", unit: "FPS", higher: true },
    {
      key: "allocated",
      label: "Client bytes allocated",
      unit: "bytes per message",
      higher: false,
    },
  ];

const number = new Intl.NumberFormat("en-US");

function sorted(test: Test, metric: Metric, higher: boolean): Row[] {
  return [...test.rows].sort((a, b) =>
    higher ? b[metric] - a[metric] : a[metric] - b[metric],
  );
}

function Switch<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="m-0 inline-flex rounded-lg border p-0.5 text-sm">
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
          className={
            value === option.key
              ? "rounded-md bg-fd-accent px-3 py-1 font-medium text-fd-accent-foreground"
              : "rounded-md px-3 py-1 text-fd-muted-foreground hover:text-fd-foreground"
          }
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}

function LibraryTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  const name = payload?.value ?? "";
  const ours = name === OURS;
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fontSize={12}
      fontWeight={ours ? 600 : 400}
      fill={
        ours ? "var(--color-fd-foreground)" : "var(--color-fd-muted-foreground)"
      }
    >
      {name}
    </text>
  );
}

function TestTooltip({
  active,
  payload,
  metric,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
  metric: Metric;
}) {
  const item = payload?.[0]?.payload;
  if (!active || !item) {
    return null;
  }
  const unit = METRICS.find((entry) => entry.key === metric)?.unit ?? "";
  return (
    <div className="rounded-lg border bg-fd-popover px-3 py-2 text-xs shadow-md">
      <div className="text-sm font-semibold text-fd-popover-foreground">
        {number.format(item[metric])} {unit}
      </div>
      <div className="text-fd-muted-foreground">{item.library}</div>
      {metric === "fps" && (
        <div className="mt-1 text-fd-muted-foreground">
          {item.low} to {item.high} FPS, P10 to P90
        </div>
      )}
      <div className="text-fd-muted-foreground">
        {number.format(item.bytes)} bytes per message
      </div>
    </div>
  );
}

const TestChart = memo(function TestChart({
  test,
  metric,
  higher,
}: {
  test: Test;
  metric: Metric;
  higher: boolean;
}) {
  const rows = sorted(test, metric, higher);
  const rival = rows.find((row) => row.library !== OURS)?.library;
  const labelled = (name: string) => name === OURS || name === rival;
  return (
    <ResponsiveContainer
      width="100%"
      height={rows.length * ROW_HEIGHT + AXIS_BAND}
    >
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
        barCategoryGap={6}
      >
        <CartesianGrid horizontal={false} stroke="var(--viz-grid)" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={{ stroke: "var(--viz-axis)" }}
          tick={{ fontSize: 11, fill: "var(--color-fd-muted-foreground)" }}
          tickFormatter={(value: number) => number.format(value)}
        />
        <YAxis
          type="category"
          dataKey="library"
          width={112}
          interval={0}
          tickLine={false}
          axisLine={false}
          tick={<LibraryTick />}
        />
        <Tooltip
          cursor={{ fill: "var(--viz-hover)" }}
          content={<TestTooltip metric={metric} />}
          isAnimationActive={false}
        />
        <Bar
          dataKey={metric}
          maxBarSize={16}
          minPointSize={2}
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
        >
          {rows.map((row) => (
            <Cell
              key={row.library}
              fill={
                row.library === OURS ? "var(--viz-accent)" : "var(--viz-rest)"
              }
            />
          ))}
          <LabelList
            dataKey={metric}
            position="right"
            fontSize={11}
            fill="var(--color-fd-foreground)"
            content={(props) => {
              const { x, y, width, height, value, index } = props as {
                x: number;
                y: number;
                width: number;
                height: number;
                value: number;
                index: number;
              };
              const row = rows[index];
              if (!row || !labelled(row.library)) {
                return null;
              }
              return (
                <text
                  x={x + width + 6}
                  y={y + height / 2}
                  dy={4}
                  fontSize={11}
                  fontWeight={row.library === OURS ? 600 : 400}
                  fill="var(--color-fd-foreground)"
                >
                  {number.format(value)}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

const TestTable = memo(function TestTable({
  test,
  metric,
  higher,
}: {
  test: Test;
  metric: Metric;
  higher: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-xs tabular-nums">
        <thead className="text-fd-muted-foreground">
          <tr>
            <th className="py-1 pr-2 text-left font-medium">Library</th>
            <th className="px-2 py-1 text-right font-medium">FPS</th>
            <th className="px-2 py-1 text-right font-medium">P10 to P90</th>
            <th className="px-2 py-1 text-right font-medium">
              Bytes per message
            </th>
            <th className="px-2 py-1 text-right font-medium">KB/s at 60 FPS</th>
            <th className="py-1 pl-2 text-right font-medium">
              Allocated per message
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted(test, metric, higher).map((row) => (
            <tr
              key={row.library}
              className={
                row.library === OURS ? "border-t font-semibold" : "border-t"
              }
            >
              <td className="py-1 pr-2">{row.library}</td>
              <td className="px-2 py-1 text-right">{row.fps}</td>
              <td className="px-2 py-1 text-right">
                {row.low} to {row.high}
              </td>
              <td className="px-2 py-1 text-right">
                {number.format(row.bytes)}
              </td>
              <td className="px-2 py-1 text-right">
                {number.format(row.rate)}
              </td>
              <td className="py-1 pl-2 text-right">
                {number.format(row.allocated)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

function TestCard({
  test,
  label,
  higher,
  children,
}: {
  test: Test;
  label: string;
  higher: boolean;
  children: ReactNode;
}) {
  return (
    <figure className="m-0 rounded-xl border bg-fd-card p-4">
      <figcaption className="mb-3">
        <div className="font-semibold text-fd-card-foreground">{test.name}</div>
        <div className="text-xs text-fd-muted-foreground">
          Sends {test.sends}. {label}, {higher ? "higher" : "lower"} is better.
        </div>
      </figcaption>
      {children}
      {test.unsupported.length > 0 && (
        <p className="mt-2 text-xs text-fd-muted-foreground">
          {test.unsupported.join(" and ")} can't send this test.
        </p>
      )}
    </figure>
  );
}

export function Benchmarks() {
  const [metric, setMetric] = useState<Metric>("fps");
  const [view, setView] = useState<View>("chart");
  const shown = useDeferredValue(metric);
  const chosen = METRICS.find((entry) => entry.key === shown) ?? METRICS[0];
  const charts = view === "chart";
  return (
    <div className="viz not-prose my-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Switch
          label="Measure"
          value={metric}
          options={METRICS.map((entry) => ({
            key: entry.key,
            label: entry.label,
          }))}
          onChange={setMetric}
        />
        <Switch
          label="View"
          value={view}
          options={[
            { key: "chart", label: "Chart" },
            { key: "table", label: "Table" },
          ]}
          onChange={setView}
        />
      </div>
      <div
        className={
          shown === metric
            ? "relative"
            : "relative opacity-60 transition-opacity"
        }
      >
        <div
          aria-hidden={!charts}
          className={
            charts
              ? "grid gap-4 lg:grid-cols-2"
              : "invisible absolute inset-x-0 top-0 grid h-0 gap-4 overflow-hidden lg:grid-cols-2"
          }
        >
          {TESTS.map((test) => (
            <TestCard
              key={test.name}
              test={test}
              label={chosen.label}
              higher={chosen.higher}
            >
              <TestChart test={test} metric={shown} higher={chosen.higher} />
            </TestCard>
          ))}
        </div>
        <div className={charts ? "hidden" : "grid gap-4"}>
          {TESTS.map((test) => (
            <TestCard
              key={test.name}
              test={test}
              label={chosen.label}
              higher={chosen.higher}
            >
              <TestTable test={test} metric={shown} higher={chosen.higher} />
            </TestCard>
          ))}
        </div>
      </div>
    </div>
  );
}
