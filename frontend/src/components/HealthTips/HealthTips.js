import React, { useState, useEffect } from 'react';
import './HealthTips.css';

const HEALTH_TIPS = [
  { icon: '💧', category: 'Hydration',   tip: 'Drink at least 8 glasses of water daily. Start your morning with a glass of warm water to kickstart your metabolism.' },
  { icon: '😴', category: 'Sleep',       tip: 'Aim for 7-9 hours of quality sleep each night. A consistent sleep schedule improves memory, mood, and overall health.' },
  { icon: '🥗', category: 'Diet',        tip: 'Fill half your plate with vegetables and fruits. A colorful plate means a variety of nutrients for your body.' },
  { icon: '🏃', category: 'Exercise',    tip: 'Even a 30-minute walk daily reduces risk of heart disease by 35%. Movement is medicine!' },
  { icon: '🧘', category: 'Mindfulness', tip: 'Take 5 minutes each morning to breathe deeply. Reducing stress lowers cortisol which helps maintain healthy weight.' },
  { icon: '🌞', category: 'Vitamin D',   tip: 'Get 15 minutes of sunlight daily. Vitamin D boosts immunity, mood, and bone health.' },
  { icon: '🥦', category: 'Nutrition',   tip: 'Eat protein with every meal. Protein keeps you full longer and helps build and repair muscle tissue.' },
  { icon: '📵', category: 'Screen Time', tip: 'Avoid screens 1 hour before bed. Blue light suppresses melatonin and disrupts your natural sleep cycle.' },
  { icon: '🍎', category: 'Snacking',    tip: 'Choose whole fruits over fruit juices. Whole fruits have fiber that slows sugar absorption and keeps you fuller.' },
  { icon: '🚶', category: 'Movement',    tip: 'Take a 5-minute walk every hour if you sit at a desk. It improves circulation and reduces back pain.' },
  { icon: '🧂', category: 'Sodium',      tip: 'Reduce salt intake to under 2300mg per day. High sodium raises blood pressure and strains your heart.' },
  { icon: '🫁', category: 'Breathing',   tip: 'Practice deep belly breathing for 2 minutes when stressed. It activates the parasympathetic nervous system.' },
  { icon: '🥜', category: 'Healthy Fats', tip: 'Include healthy fats like almonds, avocados, and olive oil. They support brain health and hormone balance.' },
  { icon: '🍵', category: 'Beverages',   tip: 'Replace one cup of coffee with green tea. Green tea has antioxidants that reduce inflammation.' },
  { icon: '🦷', category: 'Oral Health', tip: 'Brush twice and floss once daily. Poor oral health is linked to heart disease and diabetes.' },
  { icon: '🏋️', category: 'Strength',    tip: 'Add strength training 2-3 times per week. Muscle mass boosts metabolism and protects joints as you age.' },
  { icon: '🫶', category: 'Social',      tip: 'Spend time with loved ones. Strong social connections reduce risk of depression and even extend lifespan.' },
  { icon: '📖', category: 'Mental',      tip: 'Read or learn something new daily. Mental stimulation builds cognitive reserve and delays age-related decline.' },
  { icon: '🥛', category: 'Calcium',     tip: 'Get enough calcium from dairy, tofu, or leafy greens. Calcium is essential for strong bones and muscle function.' },
  { icon: '⏰', category: 'Meal Timing', tip: 'Eat your largest meal at lunch not dinner. Your metabolism is most active midday and slows in the evening.' },
  { icon: '🌿', category: 'Fiber',       tip: 'Aim for 25-30g of fiber daily from whole grains, beans, and vegetables. Fiber feeds healthy gut bacteria.' },
  { icon: '🧊', category: 'Cold Water',  tip: 'Drinking cold water can temporarily boost metabolism by 10-30%. It forces your body to warm the water.' },
  { icon: '🍳', category: 'Breakfast',   tip: 'Never skip breakfast. A protein-rich breakfast stabilizes blood sugar and reduces cravings throughout the day.' },
  { icon: '🫀', category: 'Heart',       tip: 'Laugh every day. Laughter reduces stress hormones, lowers blood pressure, and boosts immunity.' },
  { icon: '🌙', category: 'Evening',     tip: 'Have a light dinner at least 2 hours before bed. Late heavy meals disrupt sleep and slow digestion.' },
  { icon: '🦶', category: 'Posture',     tip: 'Check your posture right now. Good posture reduces fatigue, prevents injury, and improves breathing.' },
  { icon: '🧃', category: 'Sugar',       tip: 'Cut sugary drinks completely. One can of soda has 39g of sugar which exceeds the daily recommended limit.' },
  { icon: '🐟', category: 'Omega-3',     tip: 'Eat fatty fish twice a week. Omega-3s reduce inflammation, support brain health, and lower triglycerides.' },
  { icon: '🏊', category: 'Cardio',      tip: 'Swimming is one of the best full-body workouts. It is easy on joints while building strength and endurance.' },
  { icon: '🌬️', category: 'Air',         tip: 'Open your windows for 10 minutes daily. Fresh air improves concentration, mood, and sleep quality.' },
];

const HealthTips = () => {
  const [tip, setTip]   = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(function() {
    var today = new Date();
    var start = new Date(today.getFullYear(), 0, 0);
    var diff  = today - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    var index = dayOfYear % HEALTH_TIPS.length;
    setTip(HEALTH_TIPS[index]);
  }, []);

  function handleNext() {
    setFade(false);
    setTimeout(function() {
      setTip(function(prev) {
        var currentIndex = HEALTH_TIPS.indexOf(prev);
        var nextIndex = (currentIndex + 1) % HEALTH_TIPS.length;
        return HEALTH_TIPS[nextIndex];
      });
      setFade(true);
    }, 300);
  }

  function handlePrev() {
    setFade(false);
    setTimeout(function() {
      setTip(function(prev) {
        var currentIndex = HEALTH_TIPS.indexOf(prev);
        var prevIndex = (currentIndex - 1 + HEALTH_TIPS.length) % HEALTH_TIPS.length;
        return HEALTH_TIPS[prevIndex];
      });
      setFade(true);
    }, 300);
  }

  if (!tip) return null;

  return (
    <div className={'health-tip-card ' + (fade ? 'tip-fade-in' : 'tip-fade-out')}>
      <div className="tip-left">
        <div className="tip-icon">{tip.icon}</div>
      </div>
      <div className="tip-body">
        <div className="tip-header">
          <span className="tip-label">Daily Health Tip</span>
          <span className="tip-category">{tip.category}</span>
        </div>
        <p className="tip-text">{tip.tip}</p>
      </div>
      <div className="tip-nav-btns">
        <button className="tip-nav-btn" onClick={handlePrev} title="Previous tip">
          &#8249;
        </button>
        <button className="tip-nav-btn" onClick={handleNext} title="Next tip">
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default HealthTips;