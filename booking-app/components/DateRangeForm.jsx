"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DateRangeForm({ config, vertical }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (startDate && endDate) {
      router.push(
        `/booking/${vertical}?step=item&startDate=${startDate}&endDate=${endDate}`
      );
    }
  };

  return (
    <div>
      <h2>{config.copy.dateRangeLabel}</h2>
      <div className="flex">
        <input
          type="date"
          className="input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        className="button"
        onClick={handleNext}
        style={{ marginTop: "16px" }}
        disabled={!startDate || !endDate}
      >
        Next
      </button>
    </div>
  );
}
