import { Button } from "../../../../components/common/Button";
import { DAYS, type AvailabilityModalFormProps } from "../types/therapist-dashboard.types";


export const AvailabilityModalForm = ({
  title, setTitle, startTime, setStartTime, endTime, setEndTime,
  selectedDays, toggleDay, onSubmit, onCancel, isSubmitting
}: AvailabilityModalFormProps) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>Schedule Label</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full h-12 px-4 rounded-xl text-sm transition-all focus:ring-2"
        style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
        placeholder="e.g. Morning Sessions"
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full h-12 px-4 rounded-xl text-sm"
          style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full h-12 px-4 rounded-xl text-sm"
          style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
          required
        />
      </div>
    </div>

    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>Repeat on Days</label>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            className={`h-11 px-4 rounded-xl text-xs font-bold transition-all ${
              selectedDays.includes(day.value) ? "scale-105" : ""
            }`}
            style={{
              background: selectedDays.includes(day.value) ? "var(--accent-primary)" : "var(--bg-base)",
              border: `1px solid ${selectedDays.includes(day.value) ? "var(--accent-primary)" : "var(--border-default)"}`,
              color: selectedDays.includes(day.value) ? "white" : "var(--fg-secondary)"
            }}
          >
            {day.label}
          </button>
        ))}
      </div>
    </div>

    <div className="pt-4 flex gap-3">
      <Button type="button" variant="outline" className="flex-1 rounded-xl h-12" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" className="flex-1 rounded-xl h-12" loading={isSubmitting}>
        Create Rule
      </Button>
    </div>
  </form>
);