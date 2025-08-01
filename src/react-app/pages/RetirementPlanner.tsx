import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import CalculatorCard from '@/react-app/components/CalculatorCard';
import InputField from '@/react-app/components/InputField';
import ResultCard from '@/react-app/components/ResultCard';
import { User, AlertCircle } from 'lucide-react';

interface RetirementData {
  age: number;
  invested: number;
  corpus: number;
  withdrawalYears?: number;
  remainingCorpus?: number;
}

export default function RetirementPlanner() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [monthlyExpenses, setMonthlyExpenses] = useState('50000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [inflationRate, setInflationRate] = useState('6');
  const [lifeExpectancy, setLifeExpectancy] = useState('80');
  const [currentSavings, setCurrentSavings] = useState('500000');

  const calculations = useMemo(() => {
    const age = parseFloat(currentAge) || 30;
    const retAge = parseFloat(retirementAge) || 60;
    const monthlyExp = parseFloat(monthlyExpenses) || 50000;
    const returnRate = parseFloat(expectedReturn) / 100;
    const inflation = parseFloat(inflationRate) / 100;
    const lifeExp = parseFloat(lifeExpectancy) || 80;
    const currentSav = parseFloat(currentSavings) || 0;
    
    const yearsToRetirement = retAge - age;
    const retirementYears = lifeExp - retAge;
    
    if (yearsToRetirement <= 0 || retirementYears <= 0) {
      return {
        futureMonthlyExpenses: 0,
        requiredCorpus: 0,
        requiredMonthlySip: 0,
        currentSavingsFutureValue: 0,
        sipContribution: 0,
        chartData: [],
        withdrawalData: []
      };
    }
    
    // Future monthly expenses adjusted for inflation
    const futureMonthlyExpenses = monthlyExp * Math.pow(1 + inflation, yearsToRetirement);
    
    // Required corpus for retirement (assuming 4% withdrawal rule)
    const requiredCorpus = (futureMonthlyExpenses * 12) / 0.04;
    
    // Future value of current savings
    const currentSavingsFutureValue = currentSav * Math.pow(1 + returnRate, yearsToRetirement);
    
    // Shortfall to be covered by SIP
    const shortfall = Math.max(0, requiredCorpus - currentSavingsFutureValue);
    
    // Required monthly SIP
    const monthlyReturn = returnRate / 12;
    const totalMonths = yearsToRetirement * 12;
    const requiredMonthlySip = shortfall > 0
      ? (shortfall * monthlyReturn) / (Math.pow(1 + monthlyReturn, totalMonths) - 1)
      : 0;
    
    // Generate accumulation phase data
    const chartData: RetirementData[] = [];
    for (let year = 1; year <= yearsToRetirement; year++) {
      const currentAge_year = age + year;
      const monthsElapsed = year * 12;
      
      // Current savings growth
      const currentSavingsValue = currentSav * Math.pow(1 + returnRate, year);
      
      // SIP value
      const sipValue = requiredMonthlySip > 0
        ? requiredMonthlySip * (Math.pow(1 + monthlyReturn, monthsElapsed) - 1) / monthlyReturn
        : 0;
      
      const totalInvested = currentSav + (requiredMonthlySip * monthsElapsed);
      const totalCorpus = currentSavingsValue + sipValue;
      
      chartData.push({
        age: currentAge_year,
        invested: Math.round(totalInvested),
        corpus: Math.round(totalCorpus)
      });
    }
    
    // Generate withdrawal phase data
    const withdrawalData: RetirementData[] = [];
    let remainingCorpus = requiredCorpus;
    const annualWithdrawal = futureMonthlyExpenses * 12;
    
    for (let year = 1; year <= retirementYears; year++) {
      const withdrawalAge = retAge + year;
      
      // Corpus grows at expected return rate
      remainingCorpus = remainingCorpus * (1 + returnRate);
      
      // Annual withdrawal adjusted for inflation
      const inflationAdjustedWithdrawal = annualWithdrawal * Math.pow(1 + inflation, year);
      remainingCorpus -= inflationAdjustedWithdrawal;
      
      withdrawalData.push({
        age: withdrawalAge,
        invested: 0,
        corpus: Math.max(0, Math.round(remainingCorpus)),
        withdrawalYears: year,
        remainingCorpus: Math.max(0, Math.round(remainingCorpus))
      });
      
      if (remainingCorpus <= 0) break;
    }
    
    return {
      futureMonthlyExpenses: Math.round(futureMonthlyExpenses),
      requiredCorpus: Math.round(requiredCorpus),
      requiredMonthlySip: Math.round(requiredMonthlySip),
      currentSavingsFutureValue: Math.round(currentSavingsFutureValue),
      sipContribution: Math.round(shortfall),
      chartData,
      withdrawalData
    };
  }, [currentAge, retirementAge, monthlyExpenses, expectedReturn, inflationRate, lifeExpectancy, currentSavings]);

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
      title="📅 Retirement Corpus Estimator"
      description="Calculate how much you need to save for a comfortable retirement with inflation-adjusted planning."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Age"
              value={currentAge}
              onChange={setCurrentAge}
              placeholder="30"
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
          
          <InputField
            label="Current Monthly Expenses"
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            placeholder="50000"
            suffix="₹"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Expected Return"
              value={expectedReturn}
              onChange={setExpectedReturn}
              placeholder="12"
              suffix="%"
            />
            <InputField
              label="Inflation Rate"
              value={inflationRate}
              onChange={setInflationRate}
              placeholder="6"
              suffix="%"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Life Expectancy"
              value={lifeExpectancy}
              onChange={setLifeExpectancy}
              placeholder="80"
              suffix="Years"
            />
            <InputField
              label="Current Savings"
              value={currentSavings}
              onChange={setCurrentSavings}
              placeholder="500000"
              suffix="₹"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <ResultCard
            title="Required Monthly SIP"
            value={formatCurrency(calculations.requiredMonthlySip)}
            variant="primary"
          />
          
          <ResultCard
            title="Future Monthly Expenses"
            value={formatCurrency(calculations.futureMonthlyExpenses)}
            subtitle="At retirement (inflation adjusted)"
            variant="default"
          />
          
          <ResultCard
            title="Required Retirement Corpus"
            value={formatLargeNumber(calculations.requiredCorpus)}
            subtitle="Total amount needed at retirement"
            variant="success"
          />
          
          {/* Age Timeline */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Timeline</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-600">Current Age</p>
                <p className="text-lg font-bold text-purple-800">{currentAge}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Retirement Age</p>
                <p className="text-lg font-bold text-purple-800">{retirementAge}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Life Expectancy</p>
                <p className="text-lg font-bold text-purple-800">{lifeExpectancy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 space-y-8">
        {/* Accumulation Phase Chart */}
        {calculations.chartData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Wealth Accumulation Phase</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calculations.chartData}>
                  <defs>
                    <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="age" 
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
                      name === 'invested' ? 'Total Invested' : 'Total Corpus'
                    ]}
                    labelFormatter={(age) => `Age ${age}`}
                  />
                  <Legend />
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
                    dataKey="corpus"
                    stackId="2"
                    stroke="#059669"
                    strokeWidth={3}
                    fill="url(#colorCorpus)"
                    name="Total Corpus"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Withdrawal Phase Chart */}
        {calculations.withdrawalData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Retirement Withdrawal Phase</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calculations.withdrawalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="age" 
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
                    formatter={(value: number) => [formatLargeNumber(value), 'Remaining Corpus']}
                    labelFormatter={(age) => `Age ${age}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="remainingCorpus"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                    name="Remaining Corpus"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {calculations.withdrawalData.length > 0 && calculations.withdrawalData[calculations.withdrawalData.length - 1]?.remainingCorpus === 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    Corpus may be depleted before life expectancy. Consider increasing your monthly SIP.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
