import { useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import CalculatorCard from '@/react-app/components/CalculatorCard';
import InputField from '@/react-app/components/InputField';
import ResultCard from '@/react-app/components/ResultCard';
import { TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';

interface ComparisonData {
  year: number;
  fdValue: number;
  sipValue: number;
  fdInvested: number;
  sipInvested: number;
}

export default function FdVsSip() {
  const [monthlyAmount, setMonthlyAmount] = useState('10000');
  const [timePeriod, setTimePeriod] = useState('15');
  const [sipReturnRate, setSipReturnRate] = useState('12');
  const [fdReturnRate, setFdReturnRate] = useState('6.5');

  const calculations = useMemo(() => {
    const P = parseFloat(monthlyAmount) || 0;
    const years = parseFloat(timePeriod) || 0;
    const sipRate = parseFloat(sipReturnRate) / 100;
    const fdRate = parseFloat(fdReturnRate) / 100;
    
    if (P <= 0 || years <= 0) {
      return {
        fdMaturityValue: 0,
        sipMaturityValue: 0,
        totalInvested: 0,
        fdGains: 0,
        sipGains: 0,
        advantage: 0,
        chartData: []
      };
    }
    
    const totalMonths = years * 12;
    const totalInvested = P * totalMonths;
    
    // SIP Calculation
    const monthlyReturn = sipRate / 12;
    const sipMaturityValue = P * (((1 + monthlyReturn) ** totalMonths - 1) * (1 + monthlyReturn)) / monthlyReturn;
    
    // FD Calculation (assuming annual compounding for simplicity)
    // For monthly investments, we'll calculate the compound growth
    let fdMaturityValue = 0;
    for (let month = 1; month <= totalMonths; month++) {
      const monthsRemaining = totalMonths - month + 1;
      const yearsFraction = monthsRemaining / 12;
      fdMaturityValue += P * Math.pow(1 + fdRate, yearsFraction);
    }
    
    const fdGains = fdMaturityValue - totalInvested;
    const sipGains = sipMaturityValue - totalInvested;
    const advantage = sipMaturityValue - fdMaturityValue;
    
    // Generate yearly comparison data
    const chartData: ComparisonData[] = [];
    for (let year = 1; year <= years; year++) {
      const monthsElapsed = year * 12;
      const investedTillNow = P * monthsElapsed;
      
      // SIP value at this year
      const yearlyMonthlyReturn = sipRate / 12;
      const sipYearlyValue = P * (((1 + yearlyMonthlyReturn) ** monthsElapsed - 1) * (1 + yearlyMonthlyReturn)) / yearlyMonthlyReturn;
      
      // FD value at this year
      let fdYearlyValue = 0;
      for (let month = 1; month <= monthsElapsed; month++) {
        const monthsFromInvestment = monthsElapsed - month + 1;
        const yearsFractionFromInvestment = monthsFromInvestment / 12;
        fdYearlyValue += P * Math.pow(1 + fdRate, yearsFractionFromInvestment);
      }
      
      chartData.push({
        year,
        fdValue: Math.round(fdYearlyValue),
        sipValue: Math.round(sipYearlyValue),
        fdInvested: investedTillNow,
        sipInvested: investedTillNow
      });
    }
    
    return {
      fdMaturityValue: Math.round(fdMaturityValue),
      sipMaturityValue: Math.round(sipMaturityValue),
      totalInvested: Math.round(totalInvested),
      fdGains: Math.round(fdGains),
      sipGains: Math.round(sipGains),
      advantage: Math.round(advantage),
      chartData
    };
  }, [monthlyAmount, timePeriod, sipReturnRate, fdReturnRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} L`;
    }
    return formatCurrency(value);
  };

  const advantagePercentage = calculations.fdMaturityValue > 0 
    ? ((calculations.advantage / calculations.fdMaturityValue) * 100) 
    : 0;

  return (
    <CalculatorCard
      title="📈 FD vs SIP Comparison Tool"
      description="Compare the long-term returns of Fixed Deposits vs Systematic Investment Plans to make informed investment decisions."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <InputField
            label="Monthly Investment Amount"
            value={monthlyAmount}
            onChange={setMonthlyAmount}
            placeholder="10000"
            suffix="₹"
          />
          
          <InputField
            label="Investment Duration"
            value={timePeriod}
            onChange={setTimePeriod}
            placeholder="15"
            suffix="Years"
          />
          
          <InputField
            label="Expected SIP Return (Annual)"
            value={sipReturnRate}
            onChange={setSipReturnRate}
            placeholder="12"
            suffix="%"
          />
          
          <InputField
            label="FD Interest Rate (Annual)"
            value={fdReturnRate}
            onChange={setFdReturnRate}
            placeholder="6.5"
            suffix="%"
          />
        </div>

        {/* Quick Comparison */}
        <div className="space-y-4">
          <ResultCard
            title="Total Investment"
            value={formatCurrency(calculations.totalInvested)}
            variant="default"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              title="FD Maturity Value"
              value={formatLargeNumber(calculations.fdMaturityValue)}
              subtitle={`Gains: ${formatCurrency(calculations.fdGains)}`}
              variant="default"
            />
            
            <ResultCard
              title="SIP Maturity Value"
              value={formatLargeNumber(calculations.sipMaturityValue)}
              subtitle={`Gains: ${formatCurrency(calculations.sipGains)}`}
              variant="success"
            />
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600">SIP Advantage</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-800">{formatLargeNumber(calculations.advantage)}</p>
                <p className="text-sm text-emerald-600">
                  {advantagePercentage > 0 ? '+' : ''}{advantagePercentage.toFixed(1)}% more than FD
                </p>
              </div>
              {advantagePercentage > 100 && (
                <div className="text-right">
                  <p className="text-xs text-emerald-600">Wealth</p>
                  <p className="text-lg font-bold text-emerald-800">
                    {(calculations.sipMaturityValue / calculations.fdMaturityValue).toFixed(1)}x
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison Chart */}
      {calculations.chartData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Growth Comparison Over Time</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calculations.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatLargeNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    formatLargeNumber(value),
                    name === 'fdValue' ? 'FD Value' : 'SIP Value'
                  ]}
                  labelFormatter={(year) => `Year ${year}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="fdValue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  name="FD Value"
                />
                <Line
                  type="monotone"
                  dataKey="sipValue"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  name="SIP Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Year-wise Comparison Table */}
      {calculations.chartData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Detailed Year-wise Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-3 font-semibold text-slate-700">Year</th>
                  <th className="text-right p-3 font-semibold text-slate-700">FD Value</th>
                  <th className="text-right p-3 font-semibold text-slate-700">SIP Value</th>
                  <th className="text-right p-3 font-semibold text-slate-700">Difference</th>
                  <th className="text-right p-3 font-semibold text-slate-700">Advantage</th>
                </tr>
              </thead>
              <tbody>
                {calculations.chartData.filter((_, index) => index % Math.ceil(calculations.chartData.length / 10) === 0 || index === calculations.chartData.length - 1).map((data, index) => {
                  const difference = data.sipValue - data.fdValue;
                  const advantage = data.fdValue > 0 ? ((difference / data.fdValue) * 100) : 0;
                  
                  return (
                    <tr key={data.year} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-3 font-medium text-slate-800">{data.year}</td>
                      <td className="p-3 text-right text-amber-600 font-medium">{formatLargeNumber(data.fdValue)}</td>
                      <td className="p-3 text-right text-emerald-600 font-medium">{formatLargeNumber(data.sipValue)}</td>
                      <td className="p-3 text-right font-medium text-slate-800">{formatLargeNumber(difference)}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          advantage > 0 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {advantage > 0 ? '+' : ''}{advantage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-600">Fixed Deposit Benefits</span>
          </div>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Guaranteed returns</li>
            <li>• Capital protection</li>
            <li>• No market risk</li>
            <li>• Suitable for short-term goals</li>
          </ul>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600">SIP Benefits</span>
          </div>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• Higher potential returns</li>
            <li>• Inflation beating growth</li>
            <li>• Tax efficiency (ELSS funds)</li>
            <li>• Ideal for long-term wealth building</li>
          </ul>
        </div>
      </div>

      {parseFloat(timePeriod) < 5 && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">
              Short Investment Horizon: For periods less than 5 years, FDs might be more suitable due to market volatility in equity investments.
            </span>
          </div>
        </div>
      )}
    </CalculatorCard>
  );
}
