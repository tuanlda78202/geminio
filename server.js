import express from 'express';
import cors from 'cors';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new TextToSpeechClient();

app.post('/api/tts', async (req, res) => {
    try {
        const { text } = req.body;
        const request = {
            input: { text },
            voice: { languageCode: 'vi-VN', name: 'vi-VN-Wavenet-A' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await client.synthesizeSpeech(request);

        res.set('Content-Type', 'audio/mpeg');
        res.send(response.audioContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error in text-to-speech conversion');
    }
});

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));