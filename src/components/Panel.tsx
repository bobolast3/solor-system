import React from "react";

interface InfoPanelProps {
  body: Record<string, any>;
  style?: React.CSSProperties;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ body, style }) => {
  if (!body) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        color: "#fff",
        padding: "16px 20px",
        borderRadius: "12px",
        minWidth: "220px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        pointerEvents: "none",
        boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        lineHeight: 1.5,
        ...style,
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: "1.2rem",
          fontWeight: 600,
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          paddingBottom: "4px",
        }}
      >
        {body.name}
      </h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {body.radius && <li>🌐 Radius: {body.radius}</li>}
        {body.mass && <li>⚖️ Mass: {body.mass}</li>}
        {body.gravity && <li>🪐 Gravity: {body.gravity}</li>}
        {body.distanceFromSun && <li>☀️ Distance: {body.distanceFromSun}</li>}
        {body.numberOfMoons !== undefined && (
          <li>🌙 Moons: {body.numberOfMoons}</li>
        )}
        {body.atmosphere && <li>💨 Atmosphere: {body.atmosphere}</li>}
        {body.composition && <li>🧪 Composition: {body.composition}</li>}
        {body.temperature && <li>🌡️ Temperature: {body.temperature}</li>}
        {body.age && <li>⏳ Age: {body.age}</li>}
        {body.orbitPeriod && <li>🕒 Orbit: {body.orbitPeriod} days</li>}
        {body.rotationPeriod && <li>🔄 Rotation: {body.rotationPeriod} hrs</li>}
        {body.rings && <li>💍 Rings: {body.rings}</li>}
      </ul>
    </div>
  );
};
