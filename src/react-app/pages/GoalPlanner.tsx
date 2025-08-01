import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import CalculatorCard from '@/react-app/components/CalculatorCard';
import InputField from '@/react-app/components/InputField';
import ResultCard from '@/react-app/components/ResultCard';
import { Target } from 'lucide-react';

interface GoalData {
  year: number;
  invested: number;
  value: number;
  target: number;
}

export default function GoalPlanner() {
  const [targetAmount, setTargetAmount] = useState('5000000');
  const [timePeriod, setTimePeriod] = useState('15');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [currentSavings, setCurrentSavings] = useState('100000');

  const calculations = useMemo(() => {
    const targetValue = parseFloat(targetAmount) || 0;
    const years = parseFloat(timePeriod) || 0;
    const annualReturn = parseFloat(expectedReturn) / 100;
    const currentAmount = parseFloat(currentSavings) || 0;
    
    if (targetValue <= 0 || years <= 0 || annualReturn <= 0) {
      return {
        requiredMonthlySip: 0,
        futureValueOfCurrentSavings: 0,
        totalMonthlyRequired: 0,
        shortfall: 0,
        chartData: []
      };
    }

    const monthlyReturn = annualReturn / 12;
    const totalMonths = years * 12;
    
    // Future value of current savings
    const futureValueOfCurrentSavings = currentAmount * Math.pow(1 + annualReturn, years);
    
    // Shortfall to be covered by SIP
    const shortfall = Math.max(0, targetValue - futureValueOfCurrentSavings);
    
    // Required monthly SIP using PMT formula
    // PMT = FV * r / ((1 + r)^n - 1)
    const requiredMonthlySip = shortfall > 0 
      ? (shortfall * monthlyReturn) / (Math.pow(1 + monthlyReturn, totalMonths) - 1)
      : 0;

    // Generate yearly progress data
    const chartData: GoalData[] = [];
    for (let year = 1; year <= years; year++) {
      const monthsElapsed = year * 12;
      
      // Value from current savings
      const currentSavingsValue = currentAmount * Math.pow(1 + annualReturn, year);
      
      // Value from SIP contributions
      const sipValue = requiredMonthlySip > 0 
        ? requiredMonthlySip * (Math.pow(1 + monthlyReturn, monthsElapsed) - 1) / monthlyReturn
        : 0;
      
      const totalInvested = currentAmount + (requiredMonthlySip * monthsElapsed);
      const totalValue = currentSavingsValue + sipValue;
      
      chartData.push({
        year,
        invested: Math.round(totalInvested),
        value: Math.round(totalValue),
        target: targetValue
      });
    }

    return {
      requiredMonthlySip: Math.round(requiredMonthlySip),
      futureValueOfCurrentSavings: Math.round(futureValueOfCurrentSavings),
      totalMonthlyRequired: Math.round(requiredMonthlySip),
      shortfall: Math.round(shortfall),
      chartData
    };
  }, [targetAmount, timePeriod, expectedReturn, currentSavings]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const progressPercentage = calculations.chartData.length > 0 
    ? Math.min(100, (calculations.chartData[calculations.chartData.length - 1]?.value / parseFloat(targetAmount)) * 100)
    : 0;

  return (
    <CalculatorCard
      title="🎯 Goal-Based Investment Planner"
      description="Plan your investments to reach specific financial goals with precise monthly SIP calculations."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <InputField
            label="Target Amount"
            value={targetAmount}
            onChange={setTargetAmount}
            placeholder="5000000"
            suffix="₹"
          />
          
          <InputField
            label="Time Period"
            value={timePeriod}
            onChange={setTimePeriod}
            placeholder="15"
            suffix="Years"
          />
          
          <InputField
            label="Expected Annual Return"
            value={expectedReturn}
            onChange={setExpectedReturn}
            placeholder="12"
            suffix="%"
          />
          
          <InputField
            label="Current Savings"
            value={currentSavings}
            onChange={setCurrentSavings}
            placeholder="100000"
            suffix="₹"
          />
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <ResultCard
            title="Required Monthly SIP"
            value={formatCurrency(calculations.requiredMonthlySip)}
            variant="primary"
          />
          
          <ResultCard
            title="Current Savings Future Value"
            value={formatCurrency(calculations.futureValueOfCurrentSavings)}
            variant="success"
          />
          
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Goal Progress</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-slate-800">{progressPercentage.toFixed(1)}%</span>
              <span className="text-sm text-slate-600">Target Achievement</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {calculations.chartData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Goal Achievement Timeline</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calculations.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
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
                    name === 'value' ? 'Portfolio Value' : 'Target Amount'
                  ]}
                  labelFormatter={(year) => `Year ${year}`}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stackId="1"
                  stroke="#64748b"
                  strokeWidth={2}
                  fill="url(#colorInvested)"
                  name="Total Invested"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stackId="2"
                  stroke="#059669"
                  strokeWidth={3}
                  fill="url(#colorValue)"
                  name="Portfolio Value"
                />
                <ReferenceLine 
                  y={parseFloat(targetAmount)} 
                  stroke="#dc2626" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ value: "Target", position: "right" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CalculatorCard>
  );
}
