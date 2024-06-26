import { Flex, Switch, Text } from "@radix-ui/themes";
import useApp from "@/hooks/useApp";
import useResponsive from "@/hooks/useResponsive";
import Links from "./components/Links";

const App = () => {
  const {
    isLoading,
    videoRef,
    response,
    listening,
    autoMode,
    setAutoMode,
    conversationHistory,
  } = useApp();
  const { isMobile } = useResponsive();

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-black p-8">
      <Links />
      <div className="lg:w-2/3 lg:h-full md:w-2/3 md:h-full sm:w-full h-4/6 sm:mr-2 mb-2 sm:mb-0">
        <div
          className={`justify-center overflow-hidden flex items-center rounded-[30px] h-full ${isLoading ? "border-anim p-[3px]" : "border-[3.5px]"
            }`}
        >
          <video
            ref={videoRef}
            className="w-full h-full video-container"
            autoPlay
            playsInline
            muted
            style={{ borderRadius: isLoading ? 30 : 0 }}
          />
        </div>
      </div>
      <div className="lg:w-1/3 lg:h-full md:w-1/3 md:h-full sm:w-full h-2/6">
        <div
          className={`bg-black p-4 ${isMobile ? "ml-0" : "ml-6"
            } h-full w-full justify-center flex items-center`}
        >
          <Flex direction={"column"} gap={"5"} mb={isMobile ? "9" : "1"}>
            <Text
              className="text-white text-center"
              size={"6"}
              weight={"medium"}
            >
              {response
                ? response
                : listening
                  ? "Đang lắng nghe...🧏🏻"
                  : isLoading
                    ? "Đang nhận câu hỏi...👨🏼‍💻"
                    : autoMode
                      ? "Auto mode enabled"
                      : `Hãy nói "Xin chào GDG Hà Nội"`}
            </Text>
          </Flex>
          <Flex
            direction={"column"}
            className="absolute bottom-0 py-4 text-center"
          >
            <Flex gap="2" mb={isMobile ? "3" : "1"}>
              <Switch
                checked={autoMode}
                onCheckedChange={() => setAutoMode(!autoMode)}
              />
              <Text className="text-white text-center">Auto mode</Text>
            </Flex>

            {!autoMode && (
              <Text
                mt={"3"}
                className="text-white text-center"
                size={"4"}
                weight={"medium"}
              >
              </Text>
            )}

            <img
              className="w-28 ml-3"
              src={
                "https://ppc.land/content/images/size/w1200/2023/12/Google-Gemini-AI-2.webp"
              }
            />
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default App;