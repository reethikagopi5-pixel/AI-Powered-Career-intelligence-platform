import React from 'react';
import { AnalysisResult, UserProfile } from '../types';
import { TrendingUp, Award, BarChart3, Zap, IndianRupee } from 'lucide-react';
import { formatRupeeSalary } from '../utils/salaryFormatter';

interface SalaryPredictionProps {
  analysis: AnalysisResult | null;
  user: UserProfile;
}

export const SalaryPrediction: React.FC<SalaryPredictionProps> = ({ analysis, user }) => {
  const salaryData = analysis?.salaryPrediction || {
    currentEstimatedMin: 850000,
    currentEstimatedAvg: 1450000,
    currentEstimatedMax: 2400000,
    currency: '₹',
    trajectory: [
      { year: 1, yearLabel: 'Year 1', minSalary: 850000, avgSalary: 1150000, maxSalary: 1450000 },
      { year: 2, yearLabel: 'Year 2', minSalary: 1050000, avgSalary: 1450000, maxSalary: 1800000 },
      { year: 3, yearLabel: 'Year 3', minSalary: 1350000, avgSalary: 1850000, maxSalary: 2250000 },
      { year: 4, yearLabel: 'Year 4', minSalary: 1700000, avgSalary: 2250000, maxSalary: 2800000 },
      { year: 5, yearLabel: 'Year 5', minSalary: 2100000, avgSalary: 2750000, maxSalary: 3500000 },
    ],
    topSkillPremiums: [
      { skill: 'System Architecture & Design', estimatedValueBoost: '+₹2.5 Lakhs/yr Boost' },
      { skill: 'Docker & Cloud Infra', estimatedValueBoost: '+₹1.8 Lakhs/yr Boost' },
      { skill: 'Microservices & DevOps', estimatedValueBoost: '+₹1.2 Lakhs/yr Boost' },
    ],
    marketDemandFactor: 'High Demand (Top 12% in Market)',
  };

  const avgFormatted = formatRupeeSalary(salaryData.currentEstimatedAvg);
  const minFormatted = formatRupeeSalary(salaryData.currentEstimatedMin);
  const maxFormatted = formatRupeeSalary(salaryData.currentEstimatedMax);

  const maxVal = Math.max(...salaryData.trajectory.map((t) => t.maxSalary));

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Market Valuation Engine
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mt-2">
              Salary Range & 5-Year Forecast
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Compensation estimate calculated for{' '}
              <span className="font-bold text-[#0F172A]">{user.targetRole || 'Software Engineer'}</span> based on parsed experience level and technical skill set in INR (₹).
            </p>
          </div>

          <div className="bg-[#0F172A] text-white p-5 rounded-xl flex items-center gap-6 min-w-64">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Current Market Median</p>
              <p className="text-3xl font-mono font-bold text-[#3B82F6] mt-0.5">
                {avgFormatted.lpa}
              </p>
              <p className="text-[11px] font-mono text-slate-300 mt-0.5">{avgFormatted.formatted} / yr</p>
            </div>
            <div className="border-l border-slate-700 pl-6 text-xs text-slate-300">
              <p className="font-semibold text-emerald-400">{salaryData.marketDemandFactor}</p>
              <p className="text-[10px] text-slate-400">Annual compensation in India</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Year Trajectory Visual Bar Chart */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200">
          <h3 className="font-bold text-lg text-[#0F172A] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2563EB]" />
            <span>5-Year Trajectory Growth Model</span>
          </h3>
          <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
            Currency in INR (₹ / LPA)
          </span>
        </div>

        {/* Custom Bento Bar Visualizer */}
        <div className="pt-6 pb-2 px-2">
          <div className="grid grid-cols-5 gap-3 md:gap-6 items-end h-64 border-b border-slate-200 pb-3">
            {salaryData.trajectory.map((item, idx) => {
              const itemFormatted = formatRupeeSalary(item.avgSalary);
              const heightPct = Math.max(25, Math.round((item.avgSalary / maxVal) * 100));
              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full group">
                  {/* Amount Badge */}
                  <div className="mb-2 text-center">
                    <span className="font-mono text-xs font-bold text-[#16405B] block">
                      {itemFormatted.lpa}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono hidden md:block">
                      {itemFormatted.formatted}
                    </span>
                  </div>

                  {/* Bar Outer Track with explicit height */}
                  <div className="w-full h-44 bg-[#F2EDE2] border border-[#D5CDBD] rounded-t-md relative flex items-end p-1">
                    {/* Active Bar Fill */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-xs transition-all duration-700 flex flex-col justify-between items-center py-2 ${
                        idx === 0
                          ? 'bg-[#1D4A69]'
                          : idx === 4
                          ? 'bg-[#C8622A] shadow-md'
                          : 'bg-[#16405B]'
                      }`}
                    >
                      <span className="text-[10px] text-white/90 font-mono font-bold">
                        {heightPct}%
                      </span>
                    </div>
                  </div>

                  {/* Year Label */}
                  <span className="font-mono text-xs font-semibold text-slate-700 mt-2.5">
                    {item.yearLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-4 text-xs font-mono text-slate-600">
            <span>Entry Baseline Level</span>
            <span className="text-[#16405B] font-bold">
              5-Year Targeted Level: {formatRupeeSalary(salaryData.trajectory[salaryData.trajectory.length - 1].avgSalary).lpa} ({formatRupeeSalary(salaryData.trajectory[salaryData.trajectory.length - 1].avgSalary).formatted})
            </span>
          </div>
        </div>
      </div>

      {/* Current Range Breakdown & Skill Premiums */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimated Compensation Bands */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
          <h3 className="font-bold text-[#0F172A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#2563EB]" />
            <span>Target Role Compensation Bands</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Conservative Min</span>
                <span className="font-mono font-bold text-slate-900">{minFormatted.lpa} ({minFormatted.formatted})</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#0F172A]">Industry Median Target</span>
                <span className="font-mono font-bold text-[#2563EB]">{avgFormatted.lpa} ({avgFormatted.formatted})</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Top-Tier Max (Product / Global MNCs)</span>
                <span className="font-mono font-bold text-slate-900">{maxFormatted.lpa} ({maxFormatted.formatted})</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Value Boost Premiums */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-3">
          <h3 className="font-bold text-[#0F172A] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#2563EB]" />
            <span>"If You Learn This, You Earn This" Skill Map</span>
          </h3>

          <p className="text-xs text-slate-500">
            Direct financial uplift in Indian job market when acquiring specific high-demand competencies:
          </p>

          <div className="space-y-3 pt-1">
            {salaryData.topSkillPremiums.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#16405B]">Acquire: {item.skill}</span>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                    {item.estimatedValueBoost}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  <strong>Expected Impact:</strong> Increases candidate base tier in India from standard {minFormatted.lpa} to high-paying tier {maxFormatted.lpa}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

