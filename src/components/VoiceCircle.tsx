export default function VoiceCircle({ transcript }: { transcript: string }) {
  return <div key={new Date().toString()} className="voice-circle"></div>;
}
