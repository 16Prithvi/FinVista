import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CalculatorCard from '@/react-app/components/CalculatorCard';
import { Filter } from 'lucide-react';
import clsx from 'clsx';

interface Fund {
  id: string;
  name: string;
  type: 'Equity' | 'Debt' | 'Hybrid';
  category: string;
  returns: {
    '1Y': number;
    '3Y': number;
    '5Y': number;
  };
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  minInvestment: number;
  expenseRatio: number;
  aum: number; // Assets Under Management in crores
  rating: number;
}

const mockFunds: Fund[] = [
  {
    id: '1',
    name: 'Axis Bluechip Fund',
    type: 'Equity',
    category: 'Large Cap',
    returns: { '1Y': 15.2, '3Y': 12.8, '5Y': 14.1 },
    riskLevel: 'High',
    minInvestment: 500,
    expenseRatio: 1.85,
    aum: 28500,
    rating: 4
  },
  {
    id: '2',
    name: 'HDFC Corporate Bond Fund',
    type: 'Debt',
    category: 'Corporate Bond',
    returns: { '1Y': 8.1, '3Y': 7.8, '5Y': 8.2 },
    riskLevel: 'Low',
    minInvestment: 100,
    expenseRatio: 0.45,
    aum: 15200,
    rating: 5
  },
  {
    id: '3',
    name: 'ICICI Balanced Advantage Fund',
    type: 'Hybrid',
    category: 'Dynamic Asset Allocation',
    returns: { '1Y': 11.8, '3Y': 10.2, '5Y': 11.5 },
    riskLevel: 'Moderate',
    minInvestment: 100,
    expenseRatio: 1.05,
    aum: 22100,
    rating: 4
  },
  {
    id: '4',
    name: 'SBI Small Cap Fund',
    type: 'Equity',
    category: 'Small Cap',
    returns: { '1Y': 22.5, '3Y': 18.2, '5Y': 16.8 },
    riskLevel: 'Very High',
    minInvestment: 500,
    expenseRatio: 1.95,
    aum: 8900,
    rating: 3
  },
  {
    id: '5',
    name: 'Kotak Liquid Fund',
    type: 'Debt',
    category: 'Liquid',
    returns: { '1Y': 6.2, '3Y': 6.1, '5Y': 6.8 },
    riskLevel: 'Low',
    minInvestment: 1000,
    expenseRatio: 0.25,
    aum: 45600,
    rating: 5
  },
  {
    id: '6',
    name: 'Mirae Asset Large Cap Fund',
    type: 'Equity',
    category: 'Large Cap',
    returns: { '1Y': 14.8, '3Y': 13.2, '5Y': 15.1 },
    riskLevel: 'High',
    minInvestment: 1000,
    expenseRatio: 1.75,
    aum: 18700,
    rating: 4
  }
];

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444'];

export default function FundExplorer() {
  const [selectedType, setSelectedType] = useState<'All' | 'Equity' | 'Debt' | 'Hybrid'>('All');
  const [selectedRisk, setSelectedRisk] = useState<'All' | 'Low' | 'Moderate' | 'High' | 'Very High'>('All');
  const [sortBy, setSortBy] = useState<'returns' | 'aum' | 'rating'>('returns');

  const filteredFunds = useMemo(() => {
    let funds = [...mockFunds];
    
    if (selectedType !== 'All') {
      funds = funds.filter(fund => fund.type === selectedType);
    }
    
    if (selectedRisk !== 'All') {
      funds = funds.filter(fund => fund.riskLevel === selectedRisk);
    }
    
    // Sort funds
    funds.sort((a, b) => {
      switch (sortBy) {
        case 'returns':
          return b.returns['3Y'] - a.returns['3Y'];
        case 'aum':
          return b.aum - a.aum;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    return funds;
  }, [selectedType, selectedRisk, sortBy]);

  const typeDistribution = useMemo(() => {
    const distribution = mockFunds.reduce((acc, fund) => {
      acc[fund.type] = (acc[fund.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(distribution).map(([type, count]) => ({ type, count }));
  }, []);

  const performanceComparison = useMemo(() => {
    return filteredFunds.slice(0, 5).map(fund => ({
      name: fund.name.split(' ').slice(0, 2).join(' '),
      '1Y': fund.returns['1Y'],
      '3Y': fund.returns['3Y'],
      '5Y': fund.returns['5Y']
    }));
  }, [filteredFunds]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Very High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CalculatorCard
      title="📊 Mutual Fund Explorer"
      description="Explore and compare mutual funds with detailed performance analytics and filtering options."
    >
      {/* Filters */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Fund Type</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Types</option>
              <option value="Equity">Equity</option>
              <option value="Debt">Debt</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Risk Level</label>
            <select 
              value={selectedRisk} 
              onChange={(e) => setSelectedRisk(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="returns">3Y Returns</option>
              <option value="aum">AUM Size</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Fund Type Distribution */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Fund Type Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="count"
                  label={({ type, count }) => `${type}: ${count}`}
                >
                  {typeDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Performers Comparison</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Returns']} />
                <Legend />
                <Bar dataKey="1Y" fill="#64748b" name="1Y" />
                <Bar dataKey="3Y" fill="#3b82f6" name="3Y" />
                <Bar dataKey="5Y" fill="#059669" name="5Y" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fund Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Available Funds ({filteredFunds.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFunds.map((fund) => (
            <div key={fund.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">{fund.name}</h4>
                  <p className="text-sm text-slate-600">{fund.category}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={clsx(
                        'w-3 h-3 rounded-full',
                        i < fund.rating ? 'bg-yellow-400' : 'bg-slate-200'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">1Y Return</p>
                  <p className="text-lg font-bold text-emerald-600">{fund.returns['1Y']}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">3Y Return</p>
                  <p className="text-lg font-bold text-emerald-600">{fund.returns['3Y']}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">5Y Return</p>
                  <p className="text-lg font-bold text-emerald-600">{fund.returns['5Y']}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={clsx('px-2 py-1 text-xs font-medium rounded-full border', getRiskColor(fund.riskLevel))}>
                  {fund.riskLevel} Risk
                </span>
                <span className="text-sm text-slate-600">
                  AUM: ₹{(fund.aum / 100).toFixed(0)}K Cr
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-600">Min Investment</p>
                  <p className="text-sm font-semibold text-slate-800">{formatCurrency(fund.minInvestment)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Expense Ratio</p>
                  <p className="text-sm font-semibold text-slate-800">{fund.expenseRatio}%</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200">
                  Invest Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CalculatorCard>
  );
}
