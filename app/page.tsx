"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/ids/header";
import { UploadSection } from "@/components/ids/upload-section";
import { AlertBanner } from "@/components/ids/alert-banner";
import { SummaryDashboard } from "@/components/ids/summary-dashboard";
import { AttackChart } from "@/components/ids/attack-chart";
import { ThreatLog } from "@/components/ids/threat-log";
import { ModelInfo } from "@/components/ids/model-info";
import { ThreatLevel } from "@/components/ids/threat-level";
import { FutureScope } from "@/components/ids/future-scope";
import { LoginPage } from "@/components/ids/login-page";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export interface PredictionResult {
  id: number;
  type: "normal" | "attack";
  label: string;
  timestamp: string;
  confidence: number;
}

export interface AnalysisData {
  totalRecords: number;
  totalAttacks: number;
  normalTraffic: number;
  mostFrequentAttack: string;
  predictions: PredictionResult[];
  attackDistribution: Record<string, number>;
  summary: Record<string, number>;
}

const PREDICT_API_URL = "https://ids-backend-ycoa.onrender.com/predict";

function normalizePrediction(prediction: any, index: number): PredictionResult {
  const rawLabel =
    typeof prediction === "string"
      ? prediction
      : (prediction.label ??
        prediction.attack_type ??
        prediction.category ??
        "unknown");

  const normalizedLabel = String(rawLabel);
  const rawType =
    typeof prediction === "string"
      ? normalizedLabel === "normal"
        ? "normal"
        : "attack"
      : (prediction.type ??
        (normalizedLabel === "normal" ? "normal" : "attack"));

  return {
    id: index + 1,
    type: rawType === "attack" ? "attack" : "normal",
    label: normalizedLabel,
    timestamp: new Date(Date.now() + index * 1000).toISOString(),
    confidence: 100,
  };
}

function parsePredictions(response: any): PredictionResult[] {
  const rawPredictions = Array.isArray(response.predictions)
    ? response.predictions
    : [];

  return rawPredictions.map(normalizePrediction);
}

function buildAnalysisData(
  predictions: PredictionResult[],
  summary: any = {},
): AnalysisData {
  const computedDistribution = predictions.reduce<Record<string, number>>(
    (acc, prediction) => {
      acc[prediction.label] = (acc[prediction.label] || 0) + 1;
      return acc;
    },
    {},
  );

  const summaryDistribution = Object.entries(summary).reduce<
    Record<string, number>
  >((acc, [key, value]) => {
    if (typeof value === "number") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const attackDistribution =
    (summary.attack_distribution ??
    summary.attackDistribution ??
    Object.keys(summaryDistribution).length > 0)
      ? summaryDistribution
      : computedDistribution;

  const totalRecords =
    (summary.total_records ??
      summary.totalRecords ??
      Object.values(summaryDistribution).reduce(
        (total, count) => total + count,
        0,
      )) ||
    predictions.length;

  const normalTraffic =
    summary.normal_traffic ??
    summary.normalTraffic ??
    summary.normal ??
    summaryDistribution.normal ??
    totalRecords -
      (summary.total_attacks ??
        summary.totalAttacks ??
        predictions.filter((p) => p.type === "attack").length);

  const totalAttacks =
    summary.total_attacks ??
    summary.totalAttacks ??
    totalRecords - normalTraffic;

  const mostFrequentAttack =
    summary.most_frequent_attack ??
    summary.mostFrequentAttack ??
    Object.entries(attackDistribution)
      .filter(([key]) => key !== "normal")
      .sort(([, a], [, b]) => b - a)[0]?.[0] ??
    "None";

  return {
    totalRecords,
    totalAttacks,
    normalTraffic,
    mostFrequentAttack,
    predictions: predictions.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    ),
    attackDistribution,
    summary: attackDistribution,
  };
}

export default function IDSDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [systemStatus, setSystemStatus] = useState<
    "active" | "attack" | "idle"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setSystemStatus("active");
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(PREDICT_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `Prediction API request failed with status ${response.status}: ${body}`,
        );
      }

      const result = await response.json();
      console.log("Prediction API response:", result);

      const predictions = parsePredictions(result);
      const summary = result.summary ?? {};
      const data = buildAnalysisData(predictions, summary);

      setAnalysisData(data);
      setSystemStatus(data.totalAttacks > 0 ? "attack" : "active");
    } catch (error) {
      console.error("[IDS] Prediction API error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : String(error || "Unknown error"),
      );
      setAnalysisData(null);
      setSystemStatus("idle");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleExport = useCallback(() => {
    if (!analysisData) return;

    const csvContent = [
      "ID,Type,Label,Timestamp,Confidence",
      ...analysisData.predictions.map(
        (p) => `${p.id},${p.type},${p.label},${p.timestamp},${p.confidence}%`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ids_analysis_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [analysisData]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setAnalysisData(null);
    setSelectedFile(null);
    setErrorMessage(null);
    setSystemStatus("idle");
  }, []);

  const chartData = analysisData
    ? Object.entries(analysisData.summary).map(([name, value]) => ({
        name,
        value,
        color: name === "normal" ? "#00ff88" : "#ff3366",
      }))
    : [];

  const chartColor = (name: string) =>
    name === "normal" ? "#00ff88" : "#ff3366";

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header systemStatus={systemStatus} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        <UploadSection
          onFileUpload={handleFileUpload}
          isAnalyzing={isAnalyzing}
        />

        {selectedFile && !isAnalyzing && (
          <div className="rounded-2xl border border-[#2a2a3e] bg-[#12121a]/80 px-6 py-4 text-sm text-[#e4e4e7] shadow-lg shadow-[#0f172a]/20">
            Selected file:{" "}
            <span className="font-semibold text-[#00d4ff]">
              {selectedFile.name}
            </span>
          </div>
        )}

        {errorMessage && !isAnalyzing && (
          <div className="rounded-2xl border border-[#ff4d4f] bg-[#2a0b0d]/80 px-6 py-4 text-sm text-[#ffb3b3] shadow-lg shadow-[#ff4d4f]/20">
            <strong className="block font-semibold text-[#ffd6d6]">
              Prediction API error
            </strong>
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Alert Banner */}
        {analysisData && !isAnalyzing && (
          <AlertBanner
            hasThreats={analysisData.totalAttacks > 0}
            threatCount={analysisData.totalAttacks}
          />
        )}

        {/* Summary Dashboard */}
        {analysisData && !isAnalyzing && (
          <SummaryDashboard data={analysisData} />
        )}

        {/* Charts and Threat Level */}
        {analysisData && !isAnalyzing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AttackChart distribution={analysisData.attackDistribution} />
            </div>
            <div>
              <ThreatLevel
                totalRecords={analysisData.totalRecords}
                totalAttacks={analysisData.totalAttacks}
              />
            </div>
          </div>
        )}

        {/* Threat Log */}
        {analysisData && !isAnalyzing && (
          <ThreatLog
            predictions={analysisData.predictions}
            onExport={handleExport}
          />
        )}

        {analysisData && !isAnalyzing && (
          <section className="rounded-xl border border-[#2a2a3e] bg-[#12121a] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#e4e4e7]">
                  Attack Analysis
                </h2>
                <p className="text-sm text-[#71717a]">
                  Data from backend summary and prediction counts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-[#2a2a3e] bg-[#11121b] p-4">
                <h3 className="text-sm font-semibold text-[#e4e4e7] mb-4">
                  Attack Distribution
                </h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                      >
                        {chartData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={chartColor(entry.name)}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #2a2a3e",
                        }}
                        labelStyle={{ color: "#e4e4e7" }}
                        itemStyle={{ color: "#ffffff" }}
                        formatter={(value: number) => [value, "Count"]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ color: "#71717a" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-[#2a2a3e] bg-[#11121b] p-4">
                <h3 className="text-sm font-semibold text-[#e4e4e7] mb-4">
                  Attack Frequency
                </h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#71717a", fontSize: 12 }}
                        axisLine={{ stroke: "#2a2a3e" }}
                        tickLine={{ stroke: "#2a2a3e" }}
                      />
                      <YAxis
                        tick={{ fill: "#71717a", fontSize: 12 }}
                        axisLine={{ stroke: "#2a2a3e" }}
                        tickLine={{ stroke: "#2a2a3e" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #2a2a3e",
                        }}
                        labelStyle={{ color: "#e4e4e7" }}
                        itemStyle={{ color: "#ffffff" }}
                        formatter={(value: number) => [value, "Count"]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ color: "#71717a" }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[10, 10, 0, 0]}
                        fill="#ff3366"
                      >
                        {chartData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={chartColor(entry.name)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Model Info and Future Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModelInfo />
          <FutureScope />
        </div>
      </main>
    </div>
  );
}
