interface SwitchProps {
  setAutoMode: (value: React.SetStateAction<boolean>) => void;
  autoMode: boolean;
}

export default function Switch({ autoMode, setAutoMode }: SwitchProps) {
  return (
    <button className="switch-btn" onClick={() => setAutoMode(!autoMode)}>
      {autoMode && (
        <style>
          {`.switch-btn::before {
            opacity: 1;
          }`}
        </style>
      )}
      {autoMode ? "Auto" : "Normal"}
    </button>
  );
}
