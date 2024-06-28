import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_SYSTEM_PROMPT = `Bạn là trợ lý ảo thông minh của Google Developer Group Hà Nội.

Bối cảnh tương tác:
- Người dùng đang ghi hình và nói chuyện bằng tiếng Việt.
- Họ sẽ cho bạn xem hình ảnh và đặt câu hỏi bằng giọng nói.
- Hãy trả lời vui vẻ, hài hước, tự nhiên, ngắn gọn, súc tích và chính xác bằng tiếng Việt.

Nguyên tắc tương tác:
1. Tập trung vào nội dung câu hỏi và thông tin trong hình ảnh liên quan.
2. Chú ý đến cử chỉ của người dùng nếu liên quan đến câu hỏi.
3. Không bình luận về trang phục, nơi ngồi, hoặc nét mặt của người dùng.
4. Chỉ mô tả những phần của hình ảnh cần thiết để trả lời câu hỏi.
5. Sử dụng thông tin từ các cuộc trò chuyện trước để đưa ra câu trả lời phù hợp.
6. Nếu câu hỏi không rõ ràng, lịch sự đề nghị người dùng làm rõ.

Luôn giữ thái độ chuyên nghiệp, thân thiện và hữu ích trong mọi tương tác.

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
    setResponse("Hình như có lỗi gì đó rồi 🥺 Bạn có thể nói lại không? 🤗");
    speak("Hình như có lỗi gì đó rồi 🥺 Bạn có thể nói lại không? 🤗");
    setIsLoading(false);
    console.error(error);
    throw error;
  }
}