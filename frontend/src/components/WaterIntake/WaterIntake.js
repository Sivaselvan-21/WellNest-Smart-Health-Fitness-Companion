import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { waterAPI } from '../../services/api';
import './WaterIntake.css';

const UNIT_OPTIONS  = ['Liters', 'Cups'];
const GOAL_LITERS   = 2.5;
const CUP_TO_LITERS = 0.237;

function WaterGraph(props) {
  var logs = props.logs;
  var [animatedHeights, setAnimatedHeights] = useState([]);
  var animRef = useRef(null);

  var recent = logs.slice(0, 7).reverse();
  var maxLiters = 0;
  for (var i = 0; i < recent.length; i++) {
    if (Number(recent[i].liters) > maxLiters) maxLiters = Number(recent[i].liters);
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
        return maxLiters > 0 ? (Number(log.liters) / maxLiters) * plotH * eased : 0;
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
      <h3 className="graph-heading">Water Intake Progress</h3>
      <svg width="100%" viewBox={'0 0 ' + graphW + ' ' + graphH} preserveAspectRatio="xMidYMid meet">

        <line x1={padL} y1={padT} x2={padL} y2={graphH - padB} stroke="#0077b6" strokeWidth="2" />
        <line x1={padL} y1={graphH - padB} x2={graphW - padR} y2={graphH - padB} stroke="#0077b6" strokeWidth="2" />

        <text x="12" y={graphH / 2} fill="#0077b6" fontSize="11" textAnchor="middle"
          transform={'rotate(-90, 12, ' + (graphH / 2) + ')'}>Liters (L)</text>
        <text x={padL + plotW / 2} y={graphH - 2} fill="#0077b6" fontSize="11" textAnchor="middle">Entries</text>

        {/* Goal line */}
        {maxLiters > 0 && (
          <g>
            <line
              x1={padL} y1={(graphH - padB) - (Math.min(GOAL_LITERS, maxLiters) / maxLiters) * plotH}
              x2={graphW - padR} y2={(graphH - padB) - (Math.min(GOAL_LITERS, maxLiters) / maxLiters) * plotH}
              stroke="#00b4d8" strokeWidth="1.5" strokeDasharray="6,3"
            />
            <text x={graphW - padR + 2}
              y={(graphH - padB) - (Math.min(GOAL_LITERS, maxLiters) / maxLiters) * plotH + 4}
              fill="#00b4d8" fontSize="9">Goal</text>
          </g>
        )}

        {Array.from({ length: ySteps + 1 }).map(function(_, idx) {
          var val = ((maxLiters / ySteps) * idx).toFixed(1);
          var y = (graphH - padB) - (plotH / ySteps) * idx;
          return (
            <g key={idx}>
              <line x1={padL - 4} y1={y} x2={padL} y2={y} stroke="#0077b6" strokeWidth="1.5" />
              <text x={padL - 7} y={y + 4} fill="#888" fontSize="10" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {recent.map(function(log, idx) {
          var slotW = plotW / recent.length;
          var x = padL + slotW * idx + slotW / 2 - barW / 2;
          var barH = animatedHeights[idx] || 0;
          var y = (graphH - padB) - barH;
          var label = Number(log.liters).toFixed(1) + 'L';
          return (
            <g key={idx}>
              <defs>
                <linearGradient id={'wag' + idx} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00b4d8" />
                  <stop offset="100%" stopColor="#0077b6" />
                </linearGradient>
              </defs>
              <rect x={x} y={y} width={barW} height={barH} fill={'url(#wag' + idx + ')'} rx="4" />
              <text x={x + barW / 2} y={y - 4} fill="#0077b6" fontSize="9" textAnchor="middle" fontWeight="600">
                {barH > 5 ? label : ''}
              </text>
              <line x1={padL + slotW * idx + slotW / 2} y1={graphH - padB}
                x2={padL + slotW * idx + slotW / 2} y2={graphH - padB + 4} stroke="#0077b6" strokeWidth="1.5" />
              <text x={padL + slotW * idx + slotW / 2} y={graphH - padB + 14}
                fill="#888" fontSize="9" textAnchor="middle">{idx + 1}</text>
            </g>
          );
        })}

        <circle cx={padL} cy={graphH - padB} r="3" fill="#0077b6" />
      </svg>
      <p className="graph-note">Daily goal: {GOAL_LITERS}L — dashed line shows your target!</p>
    </div>
  );
}

const WaterIntake = () => {
  const [unit, setUnit]           = useState('Liters');
  const [amount, setAmount]       = useState('');
  const [notes, setNotes]         = useState('');
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(function() { fetchLogs(); }, []);

  async function fetchLogs() {
    try {
      const response = await waterAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Water logs error:', error);
    }
  }

  function toLiters(val) {
    if (unit === 'Cups') return val * CUP_TO_LITERS;
    return val;
  }

  var totalLiters = 0;
  for (var i = 0; i < logs.length; i++) {
    totalLiters += Number(logs[i].liters) || 0;
  }
  var progressPct = Math.min((totalLiters / GOAL_LITERS) * 100, 100).toFixed(0);
  var glasses = Math.round(totalLiters / 0.25);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);
    try {
      var liters = parseFloat(toLiters(Number(amount)).toFixed(3));
      var payload = {
        amount: Number(amount), unit: unit, liters: liters, notes: notes,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(),
      };
      const response = await waterAPI.logWater(payload);
      setLogs([response.data].concat(logs));
      setAmount(''); setNotes('');
      setSubmitted(true);
      toast.success('Water intake logged!');
      setTimeout(function() { setSubmitted(false); }, 2000);
    } catch (error) {
      console.error('Log water error:', error);
      toast.error('Failed to log water. Is backend running?');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      await waterAPI.deleteLog(id);
      var filtered = [];
      for (var j = 0; j < logs.length; j++) {
        if (logs[j].id !== id) filtered.push(logs[j]);
      }
      setLogs(filtered);
      toast.success('Water log deleted');
    } catch (error) {
      toast.error('Failed to delete water log');
    }
  }

  return (
    <div className="tracker-wrapper">
      <h2>Water Intake</h2>

      <div className="water-goal-card">
        <div className="water-goal-text">
          <span>{totalLiters.toFixed(2)}L</span>
          <label>of {GOAL_LITERS}L daily goal</label>
        </div>
        <div className="water-glasses">{glasses} glasses</div>
        <div className="water-progress-bar">
          <div className="water-progress-fill" style={{ width: progressPct + '%' }} />
        </div>
        <div className="water-progress-label">{progressPct}% of daily goal</div>
      </div>

      {logs.length > 1 && (
        <button className="btn-toggle-graph water-toggle" onClick={function() { setShowGraph(!showGraph); }}>
          {showGraph ? 'Hide Graph' : 'Show Progress Graph'}
        </button>
      )}

      {showGraph && <WaterGraph logs={logs} />}

      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Unit</label>
            <select value={unit} onChange={function(e) { setUnit(e.target.value); }}>
              {UNIT_OPTIONS.map(function(u) { return <option key={u} value={u}>{u}</option>; })}
            </select>
          </div>
          <div className="form-group">
            <label>Amount ({unit === 'Liters' ? 'L' : 'cups'}) *</label>
            <input type="number" value={amount}
              onChange={function(e) { setAmount(e.target.value); }}
              placeholder={unit === 'Liters' ? 'e.g. 0.5' : 'e.g. 2'}
              step="0.1" min="0" required />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Notes (optional)</label>
          <input type="text" value={notes}
            onChange={function(e) { setNotes(e.target.value); }}
            placeholder="e.g. After workout, morning glass" />
        </div>

        <div className="quick-add-btns">
          {unit === 'Liters' ? (
            <div>
              <button type="button" className="quick-btn" onClick={function() { setAmount(0.25); }}>0.25L</button>
              <button type="button" className="quick-btn" onClick={function() { setAmount(0.5); }}>0.5L</button>
              <button type="button" className="quick-btn" onClick={function() { setAmount(0.75); }}>0.75L</button>
              <button type="button" className="quick-btn" onClick={function() { setAmount(1); }}>1L</button>
            </div>
          ) : (
            <div>
              <button type="button" className="quick-btn" onClick={function() { setAmount(1); }}>1 cup</button>
              <button type="button" className="quick-btn" onClick={function() { setAmount(2); }}>2 cups</button>
              <button type="button" className="quick-btn" onClick={function() { setAmount(3); }}>3 cups</button>
              <button type="button" className="quick-btn" onClick={function() { setAmount(4); }}>4 cups</button>
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit" style={{ marginTop: '14px' }} disabled={loading}>
          {loading ? 'Saving...' : submitted ? 'Logged!' : '+ Log Water'}
        </button>
      </form>

      {logs.length > 0 && (
        <div className="log-list">
          <h3>Today's Log</h3>
          {logs.map(function(log) {
            return (
              <div key={log.id} className="log-card">
                <div className="log-info">
                  <strong>{log.amount} {log.unit}</strong>
                  <span>({Number(log.liters).toFixed(2)}L)</span>
                  {log.time && <span>{log.time}</span>}
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

export default WaterIntake;