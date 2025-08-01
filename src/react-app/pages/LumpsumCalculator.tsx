import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CalculatorCard from '@/react-app/components/CalculatorCard';
import InputField from '@/react-app/components/InputField';
import ResultCard from '@/react-app/components/ResultCard';

interface LumpsumData {
  year: number;
  invested: number;
  earned: number;
  total: number;
}

export default function LumpsumCalculator() {
  const [initialAmount, setInitialAmount] = useState('100000');
  const [timePeriod, setTimePeriod] = useState('10');
  const [returnRate, setReturnRate] = useState('12');

  const calculations = useMemo(() => {
    const P = parseFloat(initialAmount) || 0;
    const r = parseFloat(returnRate) / 100;
    const t = parseFloat(timePeriod);
    
    if (P <= 0 || r <= 0 || t <= 0) {
      return {
        finalValue: 0,
        totalEarned: 0,
        chartData: []
      };
    }
    
    // Compound Interest Formula: A = P(1 + r)^t
    const finalValue = P * Math.pow(1 + r, t);
    const totalEarned = finalValue - P;
    
    // Generate yearly data for chart
    const chartData: LumpsumData[] = [];
    for (let year = 1; year <= t; year++) {
      const yearlyValue = P * Math.pow(1 + r, year);
      const yearlyEarned = yearlyValue - P;
      
      chartData.push({
        year,
        invested: P,
        earned: Math.round(yearlyEarned),
        total: Math.round(yearlyValue)
      });
    }
    
    return {
      finalValue: Math.round(finalValue),
      totalEarned: Math.round(totalEarned),
      chartData
    };
  }, [initialAmount, timePeriod, returnRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CalculatorCard
      title="💰 Lumpsum Investment Calculator"
      description="Calculate the growth of your one-time investment using compound interest over time."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <InputField
            label="Initial Investment Amount"
            value={initialAmount}
            onChange={setInitialAmount}
            placeholder="100000"
            suffix="₹"
          />
          
          <InputField
            label="Time Period"
            value={timePeriod}
            onChange={setTimePeriod}
            placeholder="10"
            suffix="Years"
          />
          
          <InputField
            label="Expected Annual Return"
            value={returnRate}
            onChange={setReturnRate}
            placeholder="12"
            suffix="%"
          />
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <ResultCard
            title="Initial Investment"
            value={formatCurrency(parseFloat(initialAmount) || 0)}
            variant="default"
          />
          
          <ResultCard
            title="Total Earnings"
            value={formatCurrency(calculations.totalEarned)}
            variant="success"
          />
          
          <ResultCard
            title="Final Value"
            value={formatCurrency(calculations.finalValue)}
            subtitle={`${((calculations.finalValue / (parseFloat(initialAmount) || 1) - 1) * 100).toFixed(1)}% total return`}
            variant="primary"
          />
        </div>
      </div>

      {/* Chart Section */}
      {calculations.chartData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Investment vs Earnings Comparison</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculations.chartData}>
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
                    name === 'invested' ? 'Initial Investment' : 'Total Earnings'
                  ]}
                  labelFormatter={(year) => `Year ${year}`}
                />
                <Legend />
                <Bar
                  dataKey="invested"
                  fill="#64748b"
                  name="Initial Investment"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="earned"
                  fill="#059669"
                  name="Total Earnings"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CalculatorCard>
  );
}
