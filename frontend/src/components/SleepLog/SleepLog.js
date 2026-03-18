import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { sleepAPI } from '../../services/api';
import './SleepLog.css';

const QUALITY_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

var QUALITY_COLORS = {
  Excellent: '#00b894',
  Good: '#6c5ce7',
  Fair: '#fdcb6e',
  Poor: '#d63031',
};

function SleepGraph(props) {
  var logs = props.logs;
  var [animatedHeights, setAnimatedHeights] = useState([]);
  var animRef = useRef(null);

  var recent = logs.slice(0, 7).reverse();
  var maxHours = 0;
  for (var i = 0; i < recent.length; i++) {
    if (Number(recent[i].duration) > maxHours) maxHours = Number(recent[i].duration);
  }

  var graphH = 200;
  var graphW = 500;
  var padL = 55;
  var padB = 45;
  var padT = 20;
  var padR = 20;
  var plotH = graphH - padT - padB;
  var plotW = graphW - padL - padR;

  useEffect(function() {
    setAnimatedHeights(recent.map(function() { return 0; }));
    var start = null;
    var duration = 1000;
    function animate(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedHeights(recent.map(function(log) {
        return maxHours > 0 ? (Number(log.duration) / maxHours) * plotH * eased : 0;
      }));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return function() { cancelAnimationFrame(animRef.current); };
  }, [logs.length]);

  if (!recent.length) return null;

  var barW = Math.min(40, (plotW / recent.length) - 10);
  var ySteps = 5;

  return (
    <div className="graph-box">
      <h3 className="graph-heading">Sleep Duration Progress</h3>
      <svg width="100%" viewBox={'0 0 ' + graphW + ' ' + graphH} preserveAspectRatio="xMidYMid meet">

        <line x1={padL} y1={padT} x2={padL} y2={graphH - padB} stroke="#6c5ce7" strokeWidth="2" />
        <line x1={padL} y1={graphH - padB} x2={graphW - padR} y2={graphH - padB} stroke="#6c5ce7" strokeWidth="2" />

        <text x="12" y={graphH / 2} fill="#6c5ce7" fontSize="11" textAnchor="middle"
          transform={'rotate(-90, 12, ' + (graphH / 2) + ')'}>Hours (h)</text>
        <text x={padL + plotW / 2} y={graphH - 2} fill="#6c5ce7" fontSize="11" textAnchor="middle">Nights</text>

        {/* Recommended 8h line */}
        {maxHours > 0 && (
          <g>
            <line
              x1={padL} y1={(graphH - padB) - (Math.min(8, maxHours) / maxHours) * plotH}
              x2={graphW - padR} y2={(graphH - padB) - (Math.min(8, maxHours) / maxHours) * plotH}
              stroke="#00b894" strokeWidth="1.5" strokeDasharray="6,3"
            />
            <text x={graphW - padR + 2}
              y={(graphH - padB) - (Math.min(8, maxHours) / maxHours) * plotH + 4}
              fill="#00b894" fontSize="9">8h</text>
          </g>
        )}

        {Array.from({ length: ySteps + 1 }).map(function(_, idx) {
          var val = ((maxHours / ySteps) * idx).toFixed(1);
          var y = (graphH - padB) - (plotH / ySteps) * idx;
          return (
            <g key={idx}>
              <line x1={padL - 4} y1={y} x2={padL} y2={y} stroke="#6c5ce7" strokeWidth="1.5" />
              <text x={padL - 7} y={y + 4} fill="#888" fontSize="10" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {recent.map(function(log, idx) {
          var slotW = plotW / recent.length;
          var x = padL + slotW * idx + slotW / 2 - barW / 2;
          var barH = animatedHeights[idx] || 0;
          var y = (graphH - padB) - barH;
          var color = log.quality ? QUALITY_COLORS[log.quality] : '#8e54e9';
          return (
            <g key={idx}>
              <rect x={x} y={y} width={barW} height={barH} fill={color} rx="4" opacity="0.9" />
              <text x={x + barW / 2} y={y - 4} fill={color} fontSize="9" textAnchor="middle" fontWeight="600">
                {barH > 5 ? log.duration + 'h' : ''}
              </text>
              <line x1={padL + slotW * idx + slotW / 2} y1={graphH - padB}
                x2={padL + slotW * idx + slotW / 2} y2={graphH - padB + 4} stroke="#6c5ce7" strokeWidth="1.5" />
              <text x={padL + slotW * idx + slotW / 2} y={graphH - padB + 14}
                fill="#888" fontSize="9" textAnchor="middle">
                {log.quality ? log.quality.substring(0, 3) : 'N/A'}
              </text>
            </g>
          );
        })}

        <circle cx={padL} cy={graphH - padB} r="3" fill="#6c5ce7" />
      </svg>

      <div className="graph-legend-row">
        {Object.keys(QUALITY_COLORS).map(function(q) {
          return (
            <span key={q} className="legend-item">
              <span className="legend-dot" style={{ background: QUALITY_COLORS[q] }} />
              {q}
            </span>
          );
        })}
      </div>
      <p className="graph-note">Dashed line = recommended 8h sleep. Bars grow as you log more!</p>
    </div>
  );
}

const SleepLog = () => {
  const [form, setForm] = useState({
    bedtime: '', wakeTime: '', duration: '', quality: '', notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(function() { fetchLogs(); }, []);

  async function fetchLogs() {
    try {
      const response = await sleepAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Sleep logs error:', error);
    }
  }

  function handleChange(e) {
    var updated = {
      bedtime: form.bedtime, wakeTime: form.wakeTime, duration: form.duration,
      quality: form.quality, notes: form.notes, date: form.date,
    };
    updated[e.target.name] = e.target.value;
    var newBedtime  = e.target.name === 'bedtime'  ? e.target.value : form.bedtime;
    var newWakeTime = e.target.name === 'wakeTime' ? e.target.value : form.wakeTime;
    if (newBedtime && newWakeTime) {
      var bParts = newBedtime.split(':');
      var wParts = newWakeTime.split(':');
      var bh = Number(bParts[0]); var bm = Number(bParts[1]);
      var wh = Number(wParts[0]); var wm = Number(wParts[1]);
      var diffMin = (wh * 60 + wm) - (bh * 60 + bm);
      if (diffMin < 0) diffMin += 24 * 60;
      updated.duration = (diffMin / 60).toFixed(1);
    }
    setForm(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.duration) return;
    setLoading(true);
    try {
      var payload = {
        bedtime: form.bedtime, wakeTime: form.wakeTime,
        duration: Number(form.duration), quality: form.quality,
        notes: form.notes, date: new Date(form.date),
      };
      const response = await sleepAPI.logSleep(payload);
      setLogs([response.data].concat(logs));
      setForm({ bedtime: '', wakeTime: '', duration: '', quality: '', notes: '', date: new Date().toISOString().split('T')[0] });
      setSubmitted(true);
      toast.success('Sleep logged successfully!');
      setTimeout(function() { setSubmitted(false); }, 2000);
    } catch (error) {
      console.error('Log sleep error:', error);
      toast.error('Failed to log sleep. Is backend running?');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      await sleepAPI.deleteLog(id);
      var filtered = [];
      for (var i = 0; i < logs.length; i++) {
        if (logs[i].id !== id) filtered.push(logs[i]);
      }
      setLogs(filtered);
      toast.success('Sleep log deleted');
    } catch (error) {
      toast.error('Failed to delete sleep log');
    }
  }

  var totalDuration = 0;
  for (var i = 0; i < logs.length; i++) {
    totalDuration += Number(logs[i].duration) || 0;
  }
  var avgSleep = logs.length > 0 ? (totalDuration / logs.length).toFixed(1) : 0;

  return (
    <div className="tracker-wrapper">
      <h2>Sleep Log</h2>

      {logs.length > 0 && (
        <div className="tracker-stats">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg,#2d3561,#a239ca)' }}>
            <span>{logs.length}</span><label>Entries</label>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg,#4776e6,#8e54e9)' }}>
            <span>{avgSleep}h</span><label>Avg Sleep</label>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
            <span>{logs[0].duration}h</span><label>Last Night</label>
          </div>
        </div>
      )}

      {logs.length > 1 && (
        <button className="btn-toggle-graph sleep-toggle" onClick={function() { setShowGraph(!showGraph); }}>
          {showGraph ? 'Hide Graph' : 'Show Progress Graph'}
        </button>
      )}

      {showGraph && <SleepGraph logs={logs} />}

      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Bedtime</label>
            <input type="time" name="bedtime" value={form.bedtime} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Wake Time</label>
            <input type="time" name="wakeTime" value={form.wakeTime} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Hours Slept *</label>
            <input type="number" name="duration" value={form.duration} onChange={handleChange}
              placeholder="e.g. 7.5" step="0.5" min="0" max="24" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Sleep Quality</label>
            <select name="quality" value={form.quality} onChange={handleChange}>
              <option value="">Select quality</option>
              {QUALITY_OPTIONS.map(function(q) { return <option key={q} value={q}>{q}</option>; })}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Notes (optional)</label>
          <input type="text" name="notes" value={form.notes} onChange={handleChange}
            placeholder="e.g. Woke up twice, felt refreshed" />
        </div>
        <button type="submit" className="btn-submit sleep-btn" disabled={loading}>
          {loading ? 'Saving...' : submitted ? 'Logged!' : '+ Log Sleep'}
        </button>
      </form>

      {logs.length > 0 && (
        <div className="log-list">
          <h3>Sleep History</h3>
          {logs.map(function(log) {
            return (
              <div key={log.id} className="log-card">
                <div className="log-info">
                  <strong>{log.duration}h sleep</strong>
                  {log.bedtime && <span>{log.bedtime} to {log.wakeTime}</span>}
                  {log.quality && (
                    <span className="log-badge" style={{ background: QUALITY_COLORS[log.quality] + '22', color: QUALITY_COLORS[log.quality] }}>
                      {log.quality}
                    </span>
                  )}
                  {log.notes && <span className="log-notes">{log.notes}</span>}
                </div>
                <button className="btn-delete" onClick={function() { handleDelete(log.id); }}>X</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SleepLog;