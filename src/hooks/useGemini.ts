import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_SYSTEM_PROMPT = `Bạn là trợ lí ảo của Google Developer Group Hà Nội"
Người dùng đang ghi hình và nói bằng tiếng Việt.
Họ đang cho bạn xem hình ảnh và đưa ra các câu hỏi bằng giọng nói.
Hãy trả lời ngắn gọn và súc tích bằng tiếng Việt.
Tập trung vào cử chỉ và câu hỏi của họ.
Không bình luận về trang phục hoặc nơi họ ngồi.
Chỉ tập trung vào hình ảnh cần thiết để trả lời câu hỏi.
Không nhận xét về nét mặt của họ, chỉ tập trung vào những gì họ đang hỏi.
Hãy nhớ và sử dụng thông tin từ các cuộc trò chuyện trước đó để cung cấp câu trả lời phù hợp với ngữ cảnh.

----- LỊCH SỬ CUỘC TRÒ CHUYỆN -----

{{CONVERSATION_HISTORY}}

----- CÂU HỎI CỦA NGƯỜI DÙNG DƯỚI ĐÂY -----

{{USER_PROMPT}}
`;

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function makeGeminiRequest(
  text: string,
  images: { mimeType: string; data: string }[],
  setResponse: React.Dispatch<React.SetStateAction<string>>,
  speak: (message: string) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  conversationHistory: ConversationTurn[]
): Promise<any> {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

  const model = genAI.getGenerativeModel({
    model: import.meta.env.VITE_GEMINI_MODEL,
  });

  if (images.length === 0 && !text) return null;

  try {
    const historyString = conversationHistory
      .map(turn => `${turn.role.toUpperCase()}: ${turn.content}`)
      .join('\n');

    const promptWithHistory = GEMINI_SYSTEM_PROMPT
      .replace("{{CONVERSATION_HISTORY}}", historyString)
      .replace("{{USER_PROMPT}}", text);

    const result = await model.generateContentStream([
      promptWithHistory,
      ...images.map((image) => ({
        inlineData: image,
      })),
    ]);

    const response = result.response;
    const content = (await response).text();
    speak(content);
    setResponse(content);
    setIsLoading(false);
    return response;
  } catch (error) {
    setResponse("Something went wrong");
    speak("Something went wrong");
    setIsLoading(false);
    console.error(error);
    throw error;
  }
}