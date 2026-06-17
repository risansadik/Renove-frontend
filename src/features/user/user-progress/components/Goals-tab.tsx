import { motion } from "framer-motion";
import { Target, Plus, CheckCircle, Circle, Trash2 } from "lucide-react";
import type { GoalsTabProps } from "../types/user-progress.types";

export const GoalsTab = ({
  handleCreateGoal,
  newGoalText,
  setNewGoalText,
  newGoalCategory,
  setNewGoalCategory,
  newGoalDate,
  setNewGoalDate,
  goals,
  completedGoalsCount,
  handleToggleGoal,
  handleDeleteGoal,
}: GoalsTabProps) => {
  return (
    <motion.div
      key="goals"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="grid lg:grid-cols-3 gap-6"
    >
      {/* Create Goal Form */}
      <div className="lg:col-span-1 p-6 rounded-2xl space-y-4 h-fit" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
        <h3 className="font-bold text-md flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <Target size={16} className="text-amber-400" />
          <span>Create Growth Goal</span>
        </h3>
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Goal Description</label>
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="E.g. Sleep before 11 PM"
              className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Category Tag</label>
            <select
              value={newGoalCategory}
              onChange={(e) => setNewGoalCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            >
              <option value="Wellness">Wellness</option>
              <option value="Meditation">Meditation</option>
              <option value="Exercise">Exercise</option>
              <option value="Social">Social</option>
              <option value="Sober Days">Sober Days</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Target Date (Optional)</label>
            <input
              type="date"
              value={newGoalDate}
              onChange={(e) => setNewGoalDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
            style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
          >
            <Plus size={14} /> Add Goal
          </button>
        </form>
      </div>

      {/* Goals List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center p-4 rounded-xl text-xs font-semibold" style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
          <span style={{ color: "var(--accent-primary)" }}>Progress Rate</span>
          <span style={{ color: "var(--accent-primary)" }}>
            {goals.length > 0 ? `${Math.round((completedGoalsCount / goals.length) * 100)}%` : "0%"} ({completedGoalsCount} of {goals.length} goals completed)
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="py-20 rounded-2xl text-center space-y-3" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
            <Target size={24} style={{ color: "var(--fg-muted)" }} className="mx-auto" />
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>No goals added yet. Start setting goals for your recovery path!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="p-4 rounded-xl flex items-center justify-between transition-all"
                style={{
                  background: "var(--bg-subtle)",
                  border: `1px solid ${goal.completed ? "var(--border-accent)" : "var(--border-default)"}`,
                  opacity: goal.completed ? 0.75 : 1,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleGoal(goal.id)}
                    className="shrink-0 transition-transform hover:scale-110"
                    style={{ color: goal.completed ? "var(--accent-primary)" : "var(--fg-muted)" }}
                  >
                    {goal.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{
                        color: "var(--fg-primary)",
                        textDecoration: goal.completed ? "line-through" : "none",
                      }}
                    >
                      {goal.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "var(--bg-base)", color: "var(--fg-muted)" }}>
                        {goal.category}
                      </span>
                      {goal.targetDate && (
                        <span className="text-[9px]" style={{ color: "var(--fg-muted)" }}>
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};