"use client";

import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5050";

export default function BookingWidget({
  config,
  embedded = false,
  hydrationStage = "interactive",
  isReady = true,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});

  const themeVars = {
    "--color-primary": config.branding.theme.primary,
    "--color-background": config.branding.theme.background,
    "--color-text": config.branding.theme.text,
  };

  const containerClass = embedded ? "widget-embedded" : "container";

  // Determine if interactions should be enabled based on hydration stage
  const interactionsEnabled = isReady && hydrationStage === "interactive";

  return (
    <div className={containerClass} style={themeVars}>
      <div className="card">
        <h1>{config.branding.name}</h1>

        {config.vertical === "salon" && (
          <SalonFlow
            config={config}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            selections={selections}
            setSelections={setSelections}
            interactionsEnabled={interactionsEnabled}
            hydrationStage={hydrationStage}
          />
        )}

        {config.vertical === "class" && (
          <ClassFlow
            config={config}
            selections={selections}
            setSelections={setSelections}
            interactionsEnabled={interactionsEnabled}
            hydrationStage={hydrationStage}
          />
        )}

        {config.vertical === "rental" && (
          <RentalFlow
            config={config}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            selections={selections}
            setSelections={setSelections}
            interactionsEnabled={interactionsEnabled}
            hydrationStage={hydrationStage}
          />
        )}
      </div>
    </div>
  );
}

function SalonFlow({
  config,
  currentStep,
  setCurrentStep,
  selections,
  setSelections,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  const steps = config.layout.flow;

  return (
    <div>
      {steps[currentStep] === "service" && (
        <ServiceSelection
          config={config}
          selections={selections}
          setSelections={setSelections}
          onNext={() => interactionsEnabled && setCurrentStep(1)}
          interactionsEnabled={interactionsEnabled}
          hydrationStage={hydrationStage}
        />
      )}
      {steps[currentStep] === "provider" && (
        <ProviderSelection
          config={config}
          selections={selections}
          setSelections={setSelections}
          onNext={() => interactionsEnabled && setCurrentStep(2)}
          onBack={() => interactionsEnabled && setCurrentStep(0)}
          interactionsEnabled={interactionsEnabled}
          hydrationStage={hydrationStage}
        />
      )}
      {steps[currentStep] === "timeslot" && (
        <TimeSlotSelection
          config={config}
          selections={selections}
          onBack={() => interactionsEnabled && setCurrentStep(1)}
          interactionsEnabled={interactionsEnabled}
          hydrationStage={hydrationStage}
        />
      )}
    </div>
  );
}

function ClassFlow({
  config,
  selections,
  setSelections,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  return (
    <div>
      <SessionSelection
        config={config}
        selections={selections}
        setSelections={setSelections}
        interactionsEnabled={interactionsEnabled}
        hydrationStage={hydrationStage}
      />
    </div>
  );
}

function RentalFlow({
  config,
  currentStep,
  setCurrentStep,
  selections,
  setSelections,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  const steps = config.layout.flow;

  return (
    <div>
      {steps[currentStep] === "dateRange" && (
        <DateRangeSelection
          config={config}
          selections={selections}
          setSelections={setSelections}
          onNext={() => interactionsEnabled && setCurrentStep(1)}
          interactionsEnabled={interactionsEnabled}
          hydrationStage={hydrationStage}
        />
      )}
      {steps[currentStep] === "item" && (
        <ItemSelection
          config={config}
          selections={selections}
          onBack={() => interactionsEnabled && setCurrentStep(0)}
          interactionsEnabled={interactionsEnabled}
          hydrationStage={hydrationStage}
        />
      )}
    </div>
  );
}

function ServiceSelection({
  config,
  selections,
  setSelections,
  onNext,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  const handleServiceSelect = (serviceId) => {
    if (!interactionsEnabled) return;
    setSelections({ ...selections, service: serviceId });
    onNext();
  };

  return (
    <div>
      <h2>{config.copy.servicesLabel}</h2>
      <div className="grid grid-2">
        {config.catalog.map((service) => (
          <button
            key={service.id}
            className="button card"
            onClick={() => handleServiceSelect(service.id)}
            disabled={!interactionsEnabled}
            data-service-id={service.id}
          >
            <div>
              <h3>{service.name}</h3>
              <p className="text-muted">
                ${service.price} • {service.durationMinutes}min
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProviderSelection({
  config,
  selections,
  setSelections,
  onNext,
  onBack,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  const handleProviderSelect = (providerId) => {
    if (!interactionsEnabled) return;
    setSelections({ ...selections, provider: providerId });
    onNext();
  };

  return (
    <div>
      <h2>{config.copy.providersLabel}</h2>
      <div className="grid grid-2">
        {config.resources.map((provider) => (
          <button
            key={provider.id}
            className="button card"
            onClick={() => handleProviderSelect(provider.id)}
            disabled={!interactionsEnabled}
          >
            {provider.name}
          </button>
        ))}
      </div>
      <button
        className="button"
        onClick={onBack}
        style={{ marginTop: "16px" }}
        disabled={!interactionsEnabled}
      >
        Back
      </button>
    </div>
  );
}

function TimeSlotSelection({
  config,
  selections,
  onBack,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selections.service && selections.provider) {
      fetchAvailability();
    }
  }, [selections.service, selections.provider]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        serviceId: selections.service,
        providerId: selections.provider,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      const response = await fetch(`${API_BASE}/api/availability?${params}`);
      const data = await response.json();
      setSlots(data.slots || []);
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      // Fallback to mock data
      setSlots([
        { time: "09:00", available: true },
        { time: "10:00", available: true },
        { time: "11:00", available: false },
        { time: "14:00", available: true },
      ]);
    }
    setLoading(false);
  };

  const handleBooking = async (slot) => {
    if (!interactionsEnabled) return;
    try {
      const response = await fetch(`${API_BASE}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vertical: config.vertical,
          serviceId: selections.service,
          providerId: selections.provider,
          slot: slot.time,
        }),
      });
      const result = await response.json();
      alert(result.success ? "Booking confirmed!" : "Booking failed");
    } catch (error) {
      alert("Booking failed");
    }
  };

  return (
    <div>
      <h2>{config.copy.timeLabel}</h2>
      {loading ? (
        <p>Loading availability...</p>
      ) : (
        <div className="grid grid-3">
          {slots.map((slot) => (
            <button
              key={slot.time}
              className="button"
              disabled={!slot.available || !interactionsEnabled}
              onClick={() => handleBooking(slot)}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
      <button
        className="button"
        onClick={onBack}
        style={{ marginTop: "16px" }}
        disabled={!interactionsEnabled}
      >
        Back
      </button>
    </div>
  );
}

function SessionSelection({
  config,
  selections,
  setSelections,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      const response = await fetch(`${API_BASE}/api/sessions?${params}`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      // Fallback to mock data
      setSessions([
        {
          id: "yoga-mon-9",
          class: "yoga101",
          time: "Mon 9:00 AM",
          seatsLeft: 5,
        },
        {
          id: "yoga-tue-9",
          class: "yoga101",
          time: "Tue 9:00 AM",
          seatsLeft: 12,
        },
        {
          id: "pilates-wed-10",
          class: "pilates",
          time: "Wed 10:00 AM",
          seatsLeft: 3,
        },
      ]);
    }
    setLoading(false);
  };

  const handleBooking = async (session) => {
    if (!interactionsEnabled) return;
    try {
      const response = await fetch(`${API_BASE}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vertical: config.vertical,
          sessionId: session.id,
        }),
      });
      const result = await response.json();
      alert(result.success ? "Booking confirmed!" : "Booking failed");
    } catch (error) {
      alert("Booking failed");
    }
  };

  return (
    <div>
      <h2>{config.copy.sessionLabel}</h2>
      {loading ? (
        <p>Loading sessions...</p>
      ) : (
        <div className="grid">
          {sessions.map((session) => (
            <button
              key={session.id}
              className="button card"
              onClick={() => handleBooking(session)}
              disabled={session.seatsLeft === 0 || !interactionsEnabled}
            >
              <div className="flex" style={{ justifyContent: "space-between" }}>
                <span>{session.time}</span>
                <span className="text-sm text-muted">
                  {session.seatsLeft} {config.copy.seatsLeftLabel}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DateRangeSelection({
  config,
  selections,
  setSelections,
  onNext,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  return (
    <div>
      <h2>{config.copy.dateRangeLabel}</h2>
      <div className="flex">
        <input
          type="date"
          className="input"
          onChange={(e) =>
            interactionsEnabled &&
            setSelections({ ...selections, startDate: e.target.value })
          }
          disabled={!interactionsEnabled}
        />
        <input
          type="date"
          className="input"
          onChange={(e) =>
            interactionsEnabled &&
            setSelections({ ...selections, endDate: e.target.value })
          }
          disabled={!interactionsEnabled}
        />
      </div>
      <button
        className="button"
        onClick={onNext}
        style={{ marginTop: "16px" }}
        disabled={
          !selections.startDate || !selections.endDate || !interactionsEnabled
        }
      >
        Next
      </button>
    </div>
  );
}

function ItemSelection({
  config,
  selections,
  onBack,
  interactionsEnabled = true,
  hydrationStage = "interactive",
}) {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selections.startDate && selections.endDate) {
      fetchInventory();
    }
  }, [selections.startDate, selections.endDate]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const promises = config.catalog.map(async (item) => {
        const params = new URLSearchParams({
          itemId: item.id,
          startDate: selections.startDate,
          endDate: selections.endDate,
        });
        const response = await fetch(`${API_BASE}/api/inventory?${params}`);
        const data = await response.json();
        return { [item.id]: data.available || item.inventory };
      });
      const results = await Promise.all(promises);
      const inventoryMap = Object.assign({}, ...results);
      setInventory(inventoryMap);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      // Fallback to config inventory
      const fallback = config.catalog.reduce((acc, item) => {
        acc[item.id] = item.inventory;
        return acc;
      }, {});
      setInventory(fallback);
    }
    setLoading(false);
  };

  const handleBooking = async (item) => {
    if (!interactionsEnabled) return;
    try {
      const response = await fetch(`${API_BASE}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vertical: config.vertical,
          itemId: item.id,
          startDate: selections.startDate,
          endDate: selections.endDate,
        }),
      });
      const result = await response.json();
      alert(result.success ? "Booking confirmed!" : "Booking failed");
    } catch (error) {
      alert("Booking failed");
    }
  };

  return (
    <div>
      <h2>Select Rental</h2>
      {loading ? (
        <p>Checking availability...</p>
      ) : (
        <div className="grid grid-2">
          {config.catalog.map((item) => (
            <button
              key={item.id}
              className="button card"
              onClick={() => handleBooking(item)}
              disabled={inventory[item.id] === 0 || !interactionsEnabled}
            >
              <div>
                <h3>{item.name}</h3>
                <p className="text-muted">
                  ${item.pricePerNight}/night • {inventory[item.id] || 0}{" "}
                  available
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      <button
        className="button"
        onClick={onBack}
        style={{ marginTop: "16px" }}
        disabled={!interactionsEnabled}
      >
        Back
      </button>
    </div>
  );
}
