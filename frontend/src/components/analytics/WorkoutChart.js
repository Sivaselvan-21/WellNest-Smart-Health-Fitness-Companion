import React, { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { FaDumbbell } from 'react-icons/fa';
import { useDarkMode } from '../../context/DarkModeContext';

const WorkoutChart = ({ workoutLogs = [] }) => {
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
      const logsForDay = workoutLogs.filter(log => {
        const logDate = log.date || log.createdAt || log.logDate;
        return logDate && new Date(logDate).toISOString().slice(0, 10) === key;
      });
      days.push({
        day:      label,
        duration: logsForDay.reduce((s, l) => s + (l.duration || l.durationMinutes || 0), 0),
        calories: logsForDay.reduce((s, l) => s + (l.caloriesBurned || l.caloriesBurnt || l.calories || 0), 0),
        sessions: logsForDay.length,
      });
    }
    return days;
  }, [workoutLogs]);

  const totalSessions = workoutLogs.length;
  const totalDuration = workoutLogs.reduce((s, l) => s + (l.duration || l.durationMinutes || 0), 0);
  const avgDuration   = totalSessions ? Math.round(totalDuration / totalSessions) : 0;
  const totalCalories = workoutLogs.reduce((s, l) => s + (l.caloriesBurned || l.caloriesBurnt || l.calories || 0), 0);

  return (
    <div className="analytics-card">
      <div className="d-flex align-items-center gap-2 mb-1">
        <FaDumbbell color="#4f8ef7" />
        <h5 className="mb-0">Workout Activity</h5>
      </div>
      <p className="subtitle">Last 7 days — duration &amp; calories burned</p>

      <div className="mb-3">
        <span className="stat-chip">{totalSessions} sessions</span>
        <span className="stat-chip green">⏱ {totalDuration} min total</span>
        <span className="stat-chip red">🔥 {totalCalories} kcal</span>
        <span className="stat-chip yellow">avg {avgDuration} min/session</span>
      </div>

      {workoutLogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FaDumbbell /></div>
          <p>No workout logs yet. Start logging workouts to see your charts!</p>
        </div>
      ) : (
        <>
          <p className="small fw-semibold text-muted mb-1">Duration (minutes)</p>
          <div className="chart-wrap mb-3" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ fontWeight: 600 }} formatter={(v) => [`${v} min`, 'Duration']} />
                <Bar dataKey="duration" fill="#4f8ef7" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="small fw-semibold text-muted mb-1">Calories Burned</p>
          <div className="chart-wrap" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kcal`, 'Calories']} />
                <Line type="monotone" dataKey="calories" stroke="#ff6b6b" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ff6b6b', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutChart;