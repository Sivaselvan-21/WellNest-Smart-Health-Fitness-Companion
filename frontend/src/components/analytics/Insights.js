import React, { useMemo } from 'react';
import { FaLightbulb } from 'react-icons/fa';

const WATER_GOAL   = 2500;
const SLEEP_GOAL   = 8;
const WORKOUT_GOAL = 4;
const CALORIE_GOAL = 2000;

const Insights = ({ workoutLogs = [], mealLogs = [], waterLogs = [], sleepLogs = [], user }) => {

  const insights = useMemo(() => {
    const list     = [];
    const todayStr = new Date().toISOString().slice(0, 10);

    // Workout frequency this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekWorkouts = workoutLogs.filter(l =>
      new Date(l.date || l.createdAt || l.logDate) >= startOfWeek
    ).length;

    if (weekWorkouts === 0) {
      list.push({ type: 'danger', icon: '🏋️',
        title: 'No workouts this week!',
        message: `You haven't logged any workouts yet this week. Aim for at least ${WORKOUT_GOAL} sessions to stay on track.` });
    } else if (weekWorkouts < WORKOUT_GOAL) {
      list.push({ type: 'warning', icon: '💪',
        title: `${weekWorkouts}/${WORKOUT_GOAL} workouts this week`,
        message: `You need ${WORKOUT_GOAL - weekWorkouts} more session(s) to hit your weekly workout goal. Keep going!` });
    } else {
      list.push({ type: 'success', icon: '🔥',
        title: `${weekWorkouts} workouts this week — great job!`,
        message: "You're on track with your workout frequency. Consistency is the key to long-term results." });
    }

    // Today's water
    const todayWater = waterLogs
      .filter(l => new Date(l.date || l.createdAt || l.logDate).toISOString().slice(0, 10) === todayStr)
      .reduce((s, l) => {
        const amt = l.amount || l.quantity || l.volume || 0;
        return s + (amt < 20 ? amt * 250 : amt);
      }, 0);

    if (todayWater === 0) {
      list.push({ type: 'warning', icon: '💧',
        title: 'No water logged today',
        message: `Staying hydrated is critical. Try to reach ${WATER_GOAL} ml (about 10 glasses) per day.` });
    } else if (todayWater < WATER_GOAL * 0.5) {
      list.push({ type: 'danger', icon: '💧',
        title: `Only ${Math.round(todayWater)} ml water today`,
        message: "You're below 50% of your daily water goal. Drink a glass every hour to catch up!" });
    } else if (todayWater >= WATER_GOAL) {
      list.push({ type: 'success', icon: '💧',
        title: 'Daily water goal achieved!',
        message: `You've consumed ${Math.round(todayWater)} ml today. Great hydration keeps your energy up.` });
    }

    // Sleep
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const recentSleep  = sleepLogs
      .filter(l => {
        const d = new Date(l.date || l.createdAt || l.logDate).toISOString().slice(0, 10);
        return d === todayStr || d === yesterdayStr;
      })
      .reduce((s, l) => s + (l.duration || l.hours || l.sleepDuration || 0), 0);

    if (sleepLogs.length === 0) {
      list.push({ type: 'info', icon: '😴',
        title: 'Start logging your sleep',
        message: 'Sleep tracking helps identify patterns affecting your recovery and performance.' });
    } else if (recentSleep < 6) {
      list.push({ type: 'danger', icon: '😴',
        title: `Only ${recentSleep.toFixed(1)} hrs of sleep last night`,
        message: 'Sleep deprivation affects recovery, mood, and metabolism. Aim for 7-9 hours tonight.' });
    } else if (recentSleep >= SLEEP_GOAL) {
      list.push({ type: 'success', icon: '🌙',
        title: `${recentSleep.toFixed(1)} hrs sleep — well rested!`,
        message: 'Quality sleep boosts muscle recovery, mood, and metabolism. Keep this up!' });
    }

    // Today's nutrition
    const todayCalories = mealLogs
      .filter(l => new Date(l.date || l.createdAt || l.logDate).toISOString().slice(0, 10) === todayStr)
      .reduce((s, l) => s + (l.calories || l.totalCalories || 0), 0);

    if (mealLogs.length === 0) {
      list.push({ type: 'info', icon: '🥗',
        title: 'No meal logs yet',
        message: 'Log your meals to track calorie intake and get personalized nutrition insights.' });
    } else if (todayCalories > CALORIE_GOAL * 1.3) {
      list.push({ type: 'warning', icon: '🍔',
        title: `${todayCalories} kcal today — over budget`,
        message: `You're ${todayCalories - CALORIE_GOAL} kcal over your daily target. Consider lighter meals for the rest of the day.` });
    } else if (todayCalories > 0 && todayCalories <= CALORIE_GOAL) {
      list.push({ type: 'success', icon: '🥗',
        title: 'Calories on track today',
        message: `You've consumed ${todayCalories} kcal, within your target of ${CALORIE_GOAL} kcal.` });
    }

    // BMI check
    if (user?.weight && user?.height) {
      const bmi = user.weight / Math.pow(user.height / 100, 2);
      if (bmi > 25) {
        list.push({ type: 'warning', icon: '⚖️',
          title: `BMI is ${bmi.toFixed(1)} — above normal range`,
          message: 'A BMI above 25 signals overweight. Regular cardio with a calorie deficit can help.' });
      } else if (bmi < 18.5) {
        list.push({ type: 'warning', icon: '⚖️',
          title: `BMI is ${bmi.toFixed(1)} — below normal range`,
          message: 'A BMI below 18.5 indicates underweight. Increase caloric intake with nutrient-dense foods.' });
      }
    }

    // Milestone
    if (workoutLogs.length >= 5) {
      list.push({ type: 'info', icon: '🏆',
        title: `${workoutLogs.length} total workouts logged!`,
        message: "You're building a solid fitness habit. Every session counts — keep the momentum going." });
    }

    return list.slice(0, 6);
  }, [workoutLogs, mealLogs, waterLogs, sleepLogs, user]);

  return (
    <div className="analytics-card mb-4">
      <div className="d-flex align-items-center gap-2 mb-1">
        <FaLightbulb color="#ffd166" />
        <h5 className="mb-0">Actionable Insights</h5>
      </div>
      <p className="subtitle">Personalized recommendations based on your recent activity</p>

      {insights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💡</div>
          <p>Log some workouts, meals, water, and sleep to receive personalized insights!</p>
        </div>
      ) : (
        <div className="row">
          {insights.map((insight, i) => (
            <div className="col-md-6" key={i}>
              <div className={`insight-card ${insight.type}`}>
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-text">
                  <strong>{insight.title}</strong>
                  <span>{insight.message}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;