import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-2">📅 Mini Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        className="rounded-lg p-2"
      />
      <p className="mt-2 text-sm">Selected: {date.toDateString()}</p>
    </div>
  );
}


