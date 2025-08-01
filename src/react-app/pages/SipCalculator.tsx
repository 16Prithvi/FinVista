import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CalculatorCard from '@/react-app/components/CalculatorCard';
import InputField from '@/react-app/components/InputField';
import ResultCard from '@/react-app/components/ResultCard';

interface SipData {
  year: number;
  invested: number;
  maturity: number;
  wealth: number;
}

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
  const [returnRate, setReturnRate] = useState('12');
  const [investmentDuration, setInvestmentDuration] = useState('10');
  const [adjustForInflation, setAdjustForInflation] = useState(false);

  const calculations = useMemo(() => {
    const P = parseFloat(monthlyInvestment) || 0;
    const r = parseFloat(returnRate) / 100 / 12;
    const n = parseFloat(investmentDuration) * 12;
    
    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        totalInvested: 0,
        maturityValue: 0,
        wealthGained: 0,
        chartData: []
      };
    }
    
    // SIP Formula: A = P × ((1 + r)^n - 1) × (1 + r) / r
    const maturityValue = P * (((1 + r) ** n - 1) * (1 + r)) / r;
    const totalInvested = P * n;
    const wealthGained = maturityValue - totalInvested;
    
    // Generate yearly data for chart
    const chartData: SipData[] = [];
    for (let year = 1; year <= parseInt(investmentDuration); year++) {
      const monthsElapsed = year * 12;
      const yearlyMaturity = P * (((1 + r) ** monthsElapsed - 1) * (1 + r)) / r;
      const yearlyInvested = P * monthsElapsed;
      const yearlyWealth = yearlyMaturity - yearlyInvested;
      
      let adjustedMaturity = yearlyMaturity;
      if (adjustForInflation) {
        const inflationRate = 0.06; // 6% inflation
        adjustedMaturity = yearlyMaturity / ((1 + inflationRate) ** year);
      }
      
      chartData.push({
        year,
        invested: Math.round(yearlyInvested),
        maturity: Math.round(adjustedMaturity),
        wealth: Math.round(yearlyWealth)
      });
    }
    
    return {
      totalInvested: Math.round(totalInvested),
      maturityValue: Math.round(adjustForInflation ? maturityValue / ((1 + 0.06) ** parseInt(investmentDuration)) : maturityValue),
      wealthGained: Math.round(wealthGained),
      chartData
    };
  }, [monthlyInvestment, returnRate, investmentDuration, adjustForInflation]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CalculatorCard
      title="🧮 SIP Calculator"
      description="Calculate the potential returns from your Systematic Investment Plan (SIP) with compound interest visualization."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <InputField
            label="Monthly Investment"
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
            placeholder="5000"
            suffix="₹"
          />
          
          <InputField
            label="Expected Annual Return"
            value={returnRate}
            onChange={setReturnRate}
            placeholder="12"
            suffix="%"
          />
          
          <InputField
            label="Investment Duration"
            value={investmentDuration}
            onChange={setInvestmentDuration}
            placeholder="10"
            suffix="Years"
          />
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="inflation"
              checked={adjustForInflation}
              onChange={(e) => setAdjustForInflation(e.target.checked)}
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="inflation" className="text-sm font-medium text-slate-700">
              Adjust for inflation (6% annually)
            </label>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <ResultCard
            title="Total Invested"
            value={formatCurrency(calculations.totalInvested)}
            variant="default"
          />
          
          <ResultCard
            title="Wealth Gained"
            value={formatCurrency(calculations.wealthGained)}
            variant="success"
          />
          
          <ResultCard
            title="Maturity Value"
            value={formatCurrency(calculations.maturityValue)}
            subtitle={adjustForInflation ? "Inflation-adjusted value" : "Nominal value"}
            variant="primary"
          />
        </div>
      </div>

      {/* Chart Section */}
      {calculations.chartData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Investment Growth Over Time</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calculations.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'invested' ? 'Total Invested' : 
                    name === 'maturity' ? 'Maturity Value' : 'Wealth Gained'
                  ]}
                  labelFormatter={(year) => `Year ${year}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invested"
                  stroke="#64748b"
                  strokeWidth={3}
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 4 }}
                  name="Total Invested"
                />
                <Line
                  type="monotone"
                  dataKey="maturity"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  name="Maturity Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CalculatorCard>
  );
}
