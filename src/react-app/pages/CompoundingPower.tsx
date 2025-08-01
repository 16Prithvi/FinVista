import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import CalculatorCard from '@/react-app/components/CalculatorCard';
import InputField from '@/react-app/components/InputField';
import ResultCard from '@/react-app/components/ResultCard';
import { Repeat, Clock, TrendingUp, Zap } from 'lucide-react';
import clsx from 'clsx';

interface CompoundingData {
  year: number;
  earlyInvestor: number;
  lateInvestor: number;
  earlyInvestorTotal: number;
  lateInvestorTotal: number;
}



export default function CompoundingPower() {
  const [scenario, setScenario] = useState<'timing' | 'frequency'>('timing');
  
  // Timing scenario inputs
  const [earlyInvestmentAmount, setEarlyInvestmentAmount] = useState('2000');
  const [earlyInvestmentYears, setEarlyInvestmentYears] = useState('10');
  const [earlyStopAge, setEarlyStopAge] = useState('35');
  const [retirementAge, setRetirementAge] = useState('60');
  
  const [lateInvestmentAmount, setLateInvestmentAmount] = useState('4000');
  const [lateStartAge, setLateStartAge] = useState('35');
  
  // Frequency scenario inputs
  const [principalAmount, setPrincipalAmount] = useState('100000');
  const [annualRate, setAnnualRate] = useState('12');
  const [investmentPeriod, setInvestmentPeriod] = useState('20');
  
  

  const timingCalculations = useMemo(() => {
    const earlyAmount = parseFloat(earlyInvestmentAmount) || 0;
    const earlyStop = parseFloat(earlyStopAge) || 35;
    const retirement = parseFloat(retirementAge) || 60;
    
    const lateAmount = parseFloat(lateInvestmentAmount) || 0;
    const lateStart = parseFloat(lateStartAge) || 35;
    
    const returnRate = 0.12; // 12% annual return
    const earlyStartAge = 25; // Assuming early investor starts at 25
    
    const totalYears = retirement - earlyStartAge;
    const earlyInvestmentPeriod = earlyStop - earlyStartAge;
    
    if (totalYears <= 0) return { chartData: [], summary: null };
    
    const chartData: CompoundingData[] = [];
    
    for (let year = 1; year <= totalYears; year++) {
      const currentAge = earlyStartAge + year;
      
      // Early investor calculation
      let earlyValue = 0;
      let earlyTotalInvested = 0;
      
      if (year <= earlyInvestmentPeriod) {
        // Still investing
        earlyTotalInvested = earlyAmount * 12 * year;
        const monthlyReturn = returnRate / 12;
        const months = year * 12;
        earlyValue = (earlyAmount * 12) * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn * (1 + monthlyReturn);
      } else {
        // Stopped investing, but money is still growing
        earlyTotalInvested = earlyAmount * 12 * earlyInvestmentPeriod;
        const monthlyReturn = returnRate / 12;
        const investmentMonths = earlyInvestmentPeriod * 12;
        const growthYears = year - earlyInvestmentPeriod;
        
        // Value at the end of investment period
        const valueAtStop = (earlyAmount * 12) * (Math.pow(1 + monthlyReturn, investmentMonths) - 1) / monthlyReturn * (1 + monthlyReturn);
        
        // Value after additional growth
        earlyValue = valueAtStop * Math.pow(1 + returnRate, growthYears);
      }
      
      // Late investor calculation
      let lateValue = 0;
      let lateTotalInvested = 0;
      
      const lateInvestmentStartYear = lateStart - earlyStartAge;
      if (year > lateInvestmentStartYear) {
        const yearsOfInvestment = year - lateInvestmentStartYear;
        lateTotalInvested = lateAmount * 12 * yearsOfInvestment;
        const monthlyReturn = returnRate / 12;
        const months = yearsOfInvestment * 12;
        lateValue = (lateAmount * 12) * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn * (1 + monthlyReturn);
      }
      
      chartData.push({
        year: currentAge,
        earlyInvestor: Math.round(earlyValue),
        lateInvestor: Math.round(lateValue),
        earlyInvestorTotal: Math.round(earlyTotalInvested),
        lateInvestorTotal: Math.round(lateTotalInvested)
      });
    }
    
    const finalData = chartData[chartData.length - 1];
    const summary = {
      earlyTotalInvested: finalData?.earlyInvestorTotal || 0,
      earlyFinalValue: finalData?.earlyInvestor || 0,
      lateTotalInvested: finalData?.lateInvestorTotal || 0,
      lateFinalValue: finalData?.lateInvestor || 0
    };
    
    return { chartData, summary };
  }, [earlyInvestmentAmount, earlyInvestmentYears, earlyStopAge, retirementAge, lateInvestmentAmount, lateStartAge]);

  const frequencyCalculations = useMemo(() => {
    const principal = parseFloat(principalAmount) || 0;
    const rate = parseFloat(annualRate) / 100;
    const time = parseFloat(investmentPeriod) || 0;
    
    if (principal <= 0 || rate <= 0 || time <= 0) return [];
    
    const frequencies = [
      { name: 'Annually', periods: 1 },
      { name: 'Semi-Annually', periods: 2 },
      { name: 'Quarterly', periods: 4 },
      { name: 'Monthly', periods: 12 },
      { name: 'Daily', periods: 365 }
    ];
    
    return frequencies.map(freq => {
      const finalValue = principal * Math.pow(1 + rate / freq.periods, freq.periods * time);
      const totalInterest = finalValue - principal;
      
      return {
        frequency: freq.name,
        finalValue: Math.round(finalValue),
        totalInterest: Math.round(totalInterest)
      };
    });
  }, [principalAmount, annualRate, investmentPeriod]);

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

  return (
    <CalculatorCard
      title="🔁 Compounding Power Visualizer"
      description="Discover the magic of compound interest through interactive visualizations and real-world scenarios."
    >
      {/* Scenario Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setScenario('timing')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              scenario === 'timing'
                ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Early vs Late Investor
          </button>
          
          <button
            onClick={() => setScenario('frequency')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              scenario === 'frequency'
                ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            <Repeat className="w-4 h-4 inline mr-2" />
            Compounding Frequency
          </button>
        </div>
      </div>

      {scenario === 'timing' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Early Investor Inputs */}
            <div className="space-y-6">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">👶 Early Investor (Smart Sarah)</h3>
                <div className="space-y-4">
                  <InputField
                    label="Monthly Investment"
                    value={earlyInvestmentAmount}
                    onChange={setEarlyInvestmentAmount}
                    placeholder="2000"
                    suffix="₹"
                  />
                  <InputField
                    label="Investment Years"
                    value={earlyInvestmentYears}
                    onChange={setEarlyInvestmentYears}
                    placeholder="10"
                    suffix="Years"
                  />
                  <InputField
                    label="Stop Investing at Age"
                    value={earlyStopAge}
                    onChange={setEarlyStopAge}
                    placeholder="35"
                    suffix="Years"
                  />
                </div>
              </div>
            </div>

            {/* Late Investor Inputs */}
            <div className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">🏃 Late Investor (Busy Bob)</h3>
                <div className="space-y-4">
                  <InputField
                    label="Monthly Investment"
                    value={lateInvestmentAmount}
                    onChange={setLateInvestmentAmount}
                    placeholder="4000"
                    suffix="₹"
                  />
                  <InputField
                    label="Start Investing at Age"
                    value={lateStartAge}
                    onChange={setLateStartAge}
                    placeholder="35"
                    suffix="Years"
                  />
                  <InputField
                    label="Retirement Age"
                    value={retirementAge}
                    onChange={setRetirementAge}
                    placeholder="60"
                    suffix="Years"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {timingCalculations.summary && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                <h4 className="text-lg font-semibold text-emerald-800 mb-4">Smart Sarah's Journey</h4>
                <div className="space-y-3">
                  <ResultCard
                    title="Total Invested"
                    value={formatCurrency(timingCalculations.summary.earlyTotalInvested)}
                    variant="default"
                    className="bg-white"
                  />
                  <ResultCard
                    title="Final Value"
                    value={formatLargeNumber(timingCalculations.summary.earlyFinalValue)}
                    variant="success"
                    className="bg-white"
                  />
                </div>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                <h4 className="text-lg font-semibold text-orange-800 mb-4">Busy Bob's Journey</h4>
                <div className="space-y-3">
                  <ResultCard
                    title="Total Invested"
                    value={formatCurrency(timingCalculations.summary.lateTotalInvested)}
                    variant="default"
                    className="bg-white"
                  />
                  <ResultCard
                    title="Final Value"
                    value={formatLargeNumber(timingCalculations.summary.lateFinalValue)}
                    variant="primary"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Winner Declaration */}
          {timingCalculations.summary && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-semibold text-yellow-800">The Winner</span>
              </div>
              {timingCalculations.summary.earlyFinalValue > timingCalculations.summary.lateFinalValue ? (
                <p className="text-yellow-700">
                  <strong>Smart Sarah wins!</strong> Despite investing {formatCurrency(timingCalculations.summary.lateTotalInvested - timingCalculations.summary.earlyTotalInvested)} less, 
                  she has {formatLargeNumber(timingCalculations.summary.earlyFinalValue - timingCalculations.summary.lateFinalValue)} more at retirement. 
                  <em>Time in the market beats timing the market!</em>
                </p>
              ) : (
                <p className="text-yellow-700">
                  <strong>Busy Bob catches up!</strong> His higher investment amount compensates for the late start.
                </p>
              )}
            </div>
          )}

          {/* Chart */}
          {timingCalculations.chartData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Wealth Accumulation Race</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timingCalculations.chartData}>
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
                        name === 'earlyInvestor' ? 'Smart Sarah' : 'Busy Bob'
                      ]}
                      labelFormatter={(age) => `Age ${age}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earlyInvestor"
                      stroke="#059669"
                      strokeWidth={4}
                      dot={{ fill: '#059669', strokeWidth: 2, r: 5 }}
                      name="Smart Sarah (Early Investor)"
                    />
                    <Line
                      type="monotone"
                      dataKey="lateInvestor"
                      stroke="#f59e0b"
                      strokeWidth={4}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                      name="Busy Bob (Late Investor)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {scenario === 'frequency' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <InputField
                label="Principal Amount"
                value={principalAmount}
                onChange={setPrincipalAmount}
                placeholder="100000"
                suffix="₹"
              />
              
              <InputField
                label="Annual Interest Rate"
                value={annualRate}
                onChange={setAnnualRate}
                placeholder="12"
                suffix="%"
              />
              
              <InputField
                label="Investment Period"
                value={investmentPeriod}
                onChange={setInvestmentPeriod}
                placeholder="20"
                suffix="Years"
              />
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              {frequencyCalculations.length > 0 && (
                <>
                  <ResultCard
                    title="Principal Amount"
                    value={formatCurrency(parseFloat(principalAmount))}
                    variant="default"
                  />
                  
                  <ResultCard
                    title="Best Case (Daily Compounding)"
                    value={formatLargeNumber(frequencyCalculations[frequencyCalculations.length - 1]?.finalValue || 0)}
                    subtitle={`Interest: ${formatLargeNumber(frequencyCalculations[frequencyCalculations.length - 1]?.totalInterest || 0)}`}
                    variant="success"
                  />
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-600">Frequency Impact</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-800">
                      +{formatCurrency((frequencyCalculations[4]?.totalInterest || 0) - (frequencyCalculations[0]?.totalInterest || 0))}
                    </p>
                    <p className="text-sm text-purple-600">Extra earnings from daily vs annual compounding</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Frequency Comparison Chart */}
          {frequencyCalculations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Impact of Compounding Frequency</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequencyCalculations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="frequency" 
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
                        name === 'finalValue' ? 'Final Value' : 'Total Interest'
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="finalValue"
                      fill="#059669"
                      name="Final Value"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Frequency Comparison Table */}
          {frequencyCalculations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Detailed Frequency Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-3 font-semibold text-slate-700">Compounding Frequency</th>
                      <th className="text-right p-3 font-semibold text-slate-700">Final Value</th>
                      <th className="text-right p-3 font-semibold text-slate-700">Total Interest</th>
                      <th className="text-right p-3 font-semibold text-slate-700">Extra vs Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frequencyCalculations.map((data, index) => {
                      const extraInterest = data.totalInterest - (frequencyCalculations[0]?.totalInterest || 0);
                      
                      return (
                        <tr key={data.frequency} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-3 font-medium text-slate-800">{data.frequency}</td>
                          <td className="p-3 text-right text-emerald-600 font-medium">{formatLargeNumber(data.finalValue)}</td>
                          <td className="p-3 text-right font-medium text-slate-800">{formatLargeNumber(data.totalInterest)}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              extraInterest > 0 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {extraInterest > 0 ? '+' : ''}{formatCurrency(extraInterest)}
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
        </>
      )}

      {/* Key Learnings */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">🎓 Key Learnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Time is Your Best Friend</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Start investing early, even with small amounts</li>
              <li>• Compound interest works best over long periods</li>
              <li>• Every year of delay significantly impacts final wealth</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Frequency Matters</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• More frequent compounding = higher returns</li>
              <li>• Daily compounding beats annual compounding</li>
              <li>• The difference becomes significant over time</li>
            </ul>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
