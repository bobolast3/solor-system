import React from "react";

export const InstructionsOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: "999px",
        fontSize: "0.9rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        pointerEvents: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        whiteSpace: "nowrap",
      }}
    >
      Click on the Sun or any planet to view detailed information
    </div>
  );
};
