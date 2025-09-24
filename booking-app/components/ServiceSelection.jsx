"use client";

import { useRouter } from "next/navigation";

export default function ServiceSelection({ config, vertical }) {
  const router = useRouter();

  const handleSelect = (serviceId) => {
    router.push(`/booking/${vertical}?step=provider&service=${serviceId}`);
  };

  return (
    <div>
      <h2>{config.copy.servicesLabel}</h2>
      <div className="grid grid-2">
        {config.catalog.map((service) => (
          <button
            key={service.id}
            className="button card"
            onClick={() => handleSelect(service.id)}
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
