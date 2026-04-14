import React, { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FaTint, FaBed } from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';

const WATER_GOAL_ML    = 2500;
const SLEEP_GOAL_HOURS = 8;

const WaterSleepChart = ({ waterLogs = [], sleepLogs = [] }) => {
  const { darkMode } = useDarkMode();
  const axisColor = darkMode ? '#888' : '#999';
  const gridColor = darkMode ? '#2d2d3d' : '#f0f0f0';
  const tooltipStyle = {
    background: darkMode ? '#1e1e2e' : '#fff',
    border: 'none',
    borderRadius: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
  };

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key   = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });

      const waterForDay = waterLogs.filter(l => {
        const ld = l.date || l.createdAt || l.logDate;
        return ld && new Date(ld).toISOString().slice(0, 10) === key;
      });
      const sleepForDay = sleepLogs.filter(l => {
        const ld = l.date || l.createdAt || l.logDate;
        return ld && new Date(ld).toISOString().slice(0, 10) === key;
      });

      const waterMl = waterForDay.reduce((s, l) => {
        const amt = l.amount || l.quantity || l.volume || 0;
        return s + (amt < 20 ? amt * 250 : amt);
      }, 0);

      const sleepHrs = sleepForDay.reduce((s, l) =>
        s + (l.duration || l.hours || l.sleepDuration || 0), 0);

      days.push({
        day:   label,
        water: Math.round(waterMl),
        sleep: parseFloat(sleepHrs.toFixed(1)),
      });
    }
    return days;
  }, [waterLogs, sleepLogs]);

  const avgWater          = chartData.reduce((s, d) => s + d.water, 0) / 7;
  const avgSleep          = chartData.reduce((s, d) => s + d.sleep, 0) / 7;
  const waterDaysOnTarget = chartData.filter(d => d.water >= WATER_GOAL_ML).length;
  const sleepDaysOnTarget = chartData.filter(d => d.sleep >= SLEEP_GOAL_HOURS).length;
  const hasData           = waterLogs.length > 0 || sleepLogs.length > 0;

  return (
    <div className="analytics-card">
      <div className="d-flex align-items-center gap-2 mb-1">
        <FaTint color="#4f8ef7" />
        <FaBed color="#a78bfa" />
        <h5 className="mb-0">Water Intake &amp; Sleep Patterns</h5>
      </div>
      <p className="subtitle">Last 7 days vs. daily targets</p>

      <div className="mb-3 d-flex flex-wrap gap-2">
        <span className="stat-chip">💧 avg {Math.round(avgWater)} ml/day</span>
        <span className={`stat-chip ${waterDaysOnTarget >= 5 ? 'green' : 'yellow'}`}>
          🎯 {waterDaysOnTarget}/7 water days on target
        </span>
        <span className="stat-chip" style={{ background: 'rgba(167,139,250,0.1)', color: '#7c3aed' }}>
          😴 avg {avgSleep.toFixed(1)} hrs/night
        </span>
        <span className={`stat-chip ${sleepDaysOnTarget >= 5 ? 'green' : 'red'}`}>
          🎯 {sleepDaysOnTarget}/7 sleep nights on target
        </span>
      </div>

      {!hasData ? (
        <div className="empty-state">
          <div className="d-flex justify-content-center gap-3 mb-2" style={{ fontSize: '2rem', opacity: 0.4 }}>
            <FaTint /><FaBed />
          </div>
          <p>No water or sleep logs yet. Start logging to see your patterns here!</p>
        </div>
      ) : (
        <div className="chart-wrap" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="water" orientation="left"
                tick={{ fill: '#4f8ef7', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}ml`} />
              <YAxis yAxisId="sleep" orientation="right"
                tick={{ fill: '#a78bfa', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v}h`} domain={[0, 12]} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === 'water') return [`${value} ml`, 'Water'];
                  if (name === 'sleep') return [`${value} hrs`, 'Sleep'];
                  return [value, name];
                }}
              />
              <Legend
                formatter={(v) => {
                  if (v === 'water') return <span style={{ fontSize: 12, color: '#4f8ef7' }}>Water (ml)</span>;
                  if (v === 'sleep') return <span style={{ fontSize: 12, color: '#a78bfa' }}>Sleep (hrs)</span>;
                  return v;
                }}
              />
              <Bar  yAxisId="water" dataKey="water" fill="#4f8ef7" opacity={0.8} radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Line yAxisId="sleep" type="monotone" dataKey="sleep" stroke="#a78bfa" strokeWidth={2.5}
                dot={{ r: 4, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WaterSleepChart;