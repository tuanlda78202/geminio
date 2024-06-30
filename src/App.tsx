import { useState, useEffect } from "react";
import { Flex, Switch, Text } from "@radix-ui/themes";
import useApp from "@/hooks/useApp";
import VoiceCircle from "./components/VoiceCircle";

const AnimatedDots = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span className="animated-dots">{".".repeat(dotCount)}</span>;
};

const App = () => {
  const { isLoading, videoRef, response, listening, autoMode, setAutoMode } = useApp();

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-black p-8">
      <div className="absolute top-4 right-4 md:block hidden">
        <Flex gap="2" align="center">
          <Switch
            variant="surface"
            color="red"
            checked={autoMode}
            onCheckedChange={() => setAutoMode(!autoMode)}
          />
          <Text className="text-white text-center"></Text>
        </Flex>
      </div>
      <div className="lg:w-2/3 md:w-2/3 sm:w-full sm:mr-2 mb-2 sm:mb-0">
        <div
          className={`motion-gradient-border rounded-[30px] h-full ${isLoading ? "loading" : ""}`}
        >
          <div className="gradient-inner-border h-full">
            <video
              ref={videoRef}
              className="w-full h-full video-container"
              autoPlay
              playsInline
              muted
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center lg:w-1/3 lg:h-full md:w-1/3 md:h-full sm:w-full h-2/6">
        <div className={`bg-black p-4 w-full justify-center flex flex-col flex-wrap items-center`}>
          <div className="md:hidden block mb-9">
            <Switch
              variant="surface"
              color="red"
              checked={autoMode}
              onCheckedChange={() => setAutoMode(!autoMode)}
            />
          </div>
          <Flex direction={"column"} gap={"5"} mb="6">
            <Text className="text-white text-center" size={"7"} weight={"medium"}>
              {response ? (
                response
              ) : listening ? (
                <VoiceCircle />
              ) : isLoading ? (
                <span>
                  Đang xử lí câu hỏi
                  <AnimatedDots />
                </span>
              ) : autoMode ? (
                "Auto mode enabled"
              ) : (
                `Mình là Bông, trợ lí ảo thông minh của GDG Hà Nội 🤗`
              )}
            </Text>
          </Flex>
          <div className="text-center absolute bottom-0">
            <img className="w-40 mb-8" src={"../public/gdg.png"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
