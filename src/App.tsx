import { Flex, Text } from "@radix-ui/themes";
import useApp from "@/hooks/useApp";
import VoiceCircle from "./components/VoiceCircle";
import Switch from "./components/Switch";
import Loader from "./components/Loader";

const App = () => {
  const { isLoading, videoRef, response, listening, autoMode, setAutoMode, transcript } = useApp();

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-black p-8">
      <div className="absolute top-8 right-8 md:block hidden">
        <Flex align="center">
          <Switch {...{ autoMode, setAutoMode }} />
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
      <div className="flex flex-col justify-center md:w-1/3 md:h-full">
        <div className={`bg-black p-4 w-full justify-center flex flex-col flex-wrap items-center`}>
          <div className="md:hidden block mb-9">
            <Switch {...{ autoMode, setAutoMode }} />
          </div>
          <Flex direction={"column"} gap={"5"} mb="6">
            <Text className="text-white text-center" size={"7"} weight={"medium"}>
              {response ||
                (listening ? (
                  <VoiceCircle transcript={transcript} />
                ) : isLoading ? (
                  <Loader />
                ) : autoMode ? (
                  "Auto mode enabled"
                ) : (
                  `Mình là Bông, trợ lí ảo thông minh của GDG Hà Nội 🤗`
                ))}
            </Text>
          </Flex>
          <div className="text-center absolute bottom-0">
            <img className="w-40 mb-8" src="/gdg.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
