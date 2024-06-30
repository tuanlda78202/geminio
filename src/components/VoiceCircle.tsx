export default function VoiceCircle({ transcript }: { transcript: string }) {
  const key: string = transcript == "" ? transcript : new Date().toString();
  return <div key={key} className="voice-circle"></div>;
}
