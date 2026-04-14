import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { FaLeaf } from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';

const COLORS = ['#4f8ef7', '#43d9a2', '#ff6b6b', '#ffd166'];

const NutritionChart = ({ mealLogs = [], user }) => {
  const { darkMode } = useDarkMode();
  const axisColor = darkMode ? '#888' : '#999';
  const gridColor = darkMode ? '#2d2d3d' : '#f0f0f0';
  const tooltipStyle = {
    background: darkMode ? '#1e1e2e' : '#fff',
    border: 'none',
    borderRadius: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
  };

  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key   = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const logsForDay = mealLogs.filter(log => {
        const logDate = log.date || log.createdAt || log.logDate;
        return logDate && new Date(logDate).toISOString().slice(0, 10) === key;
      });
      days.push({
        day:      label,
        consumed: logsForDay.reduce((s, l) => s + (l.calories || l.totalCalories || 0), 0),
        protein:  logsForDay.reduce((s, l) => s + (l.protein || 0), 0),
        carbs:    logsForDay.reduce((s, l) => s + (l.carbs || l.carbohydrates || 0), 0),
      });
    }
    return days;
  }, [mealLogs]);

  const macroData = useMemo(() => {
    const p = mealLogs.reduce((s, l) => s + (l.protein || 0), 0);
    const c = mealLogs.reduce((s, l) => s + (l.carbs || l.carbohydrates || 0), 0);
    const f = mealLogs.reduce((s, l) => s + (l.fat || l.fats || 0), 0);
    if (!p && !c && !f) return [];
    return [
      { name: 'Protein', value: p },
      { name: 'Carbs',   value: c },
      { name: 'Fat',     value: f },
    ].filter(m => m.value > 0);
  }, [mealLogs]);

  const totalConsumed = mealLogs.reduce((s, l) => s + (l.calories || l.totalCalories || 0), 0);
  const totalBurned   = user?.caloriesBurnt || 0;
  const netCalories   = totalConsumed - totalBurned;

  return (
    <div className="analytics-card">
      <div className="d-flex align-items-center gap-2 mb-1">
        <FaLeaf color="#43d9a2" />
        <h5 className="mb-0">Nutrition Overview</h5>
      </div>
      <p className="subtitle">Calories consumed vs. burned &amp; macro breakdown</p>

      <div className="mb-3">
        <span className="stat-chip green">🥗 {totalConsumed} kcal consumed</span>
        <span className="stat-chip red">🔥 {totalBurned} kcal burned</span>
        <span className={`stat-chip ${netCalories > 0 ? 'yellow' : 'green'}`}>
          {netCalories > 0 ? `+${netCalories}` : netCalories} kcal net
        </span>
      </div>

      {mealLogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FaLeaf /></div>
          <p>No meal logs yet. Log your meals to visualize your nutrition data!</p>
        </div>
      ) : (
        <>
          <p className="small fw-semibold text-muted mb-1">Daily Calories Consumed</p>
          <div className="chart-wrap mb-3" style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#43d9a2" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#43d9a2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kcal`, 'Consumed']} />
                <Area type="monotone" dataKey="consumed" stroke="#43d9a2" strokeWidth={2.5}
                  fill="url(#colorConsumed)"
                  dot={{ r: 4, fill: '#43d9a2', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {macroData.length > 0 && (
            <>
              <p className="small fw-semibold text-muted mb-1">Macro Breakdown (all time)</p>
              <div className="chart-wrap" style={{ height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={macroData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      paddingAngle={4} dataKey="value">
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v}g`, n]} />
                    <Legend iconType="circle" iconSize={10}
                      formatter={(v) => <span style={{ fontSize: 12, color: axisColor }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NutritionChart;