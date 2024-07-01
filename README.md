# Bông - A Gemini-o Web Application

- [Bông - A Gemini-o Web Application](#bông---a-gemini-o-web-application)
  - [Overview](#overview)
  - [Features](#features)
  - [Technical Details](#technical-details)
    - [Model and Processing](#model-and-processing)
    - [Workflow](#workflow)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
- [Contributors](#contributors)

## Overview

As part of Google for Developers' mission to build for the community, the comprehensive workflow of the web application presented at the AI booth during Google I/O Extended Hanoi 2024 is shared. This application, named 'Bông', is a real-time VLM web app featuring both voice input and output capabilities.

| ![Architecture](https://github.com/tuanlda78202/geminio/blob/main/public/bong.png) | 
|:--:| 
| Speak, See, and Interact with Bong|

## Features

- **Real-time VLM Web App**: Supports both voice input and output for interactive experiences.
- **Multimodal Model Integration**: Utilizes Gemini 1.5 Flash for handling diverse inputs including audio, images, videos, and text.
- **Google Ecosystem Utilization**: Employs Google's API and WaveNet TTS for enhanced communication capabilities in Vietnamese.
- **RAG Workflow**: Incorporates Retrieval-Augmented Generation to keep the app updated with event information and GDG Hanoi news.
- **Natural and Humorous Responses**: Designed to engage attendees with real-time, context-aware interactions.

## Technical Details

### Model and Processing

- **Gemini 1.5 Flash**: A lightweight model optimized for speed and efficiency at scale, supporting up to 1M context lengths.
- **Multimodal Input**: Accepts inputs from webcam videos, microphone speech recognition, and other media types.
- **Google Cloud's WaveNet TTS**: Enhances the app's ability to communicate naturally in Vietnamese.

### Workflow

1. **Embedding Extraction**: Uses Google Text Embedding API to extract embeddings from text information on URLs.
2. **Chain Construction with LangChain**: Constructs a system prompt incorporating conversational history for memory caching.
3. **Real-time Response**: The web application responds in real-time despite noisy environments and multiple individuals in the frame.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/tuanlda78202/geminio.git
    ```

2. Navigate to the project directory:

    ```bash
    cd geminio
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Run the application:

    ```bash
    npm run dev
    ```

## Usage

1. Open port `3001` for Google Cloud TTS.
2. Open your browser and navigate to `http://localhost:3000`.
3. Allow access to your microphone and webcam.
4. Interact with the application using voice commands and visual inputs.

## Contributing

We welcome contributions from the community. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:

    ```bash
    git checkout -b feature-name
    ```

3. Commit your changes:

    ```bash
    git commit -m "Description of feature or fix"
    ```

4. Push to the branch:

    ```bash
    git push origin feature-name
    ```

5. Create a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/tuanlda78202/geminio/blob/main/LICENSE.txt) file for details.

## Contact

For any questions or feedback, please contact [me.](tuanleducanh78202@gmail.com)

# Contributors 
<a href="https://github.com/tuanlda78202/geminio/graphs/contributors">
<img src="https://contrib.rocks/image?repo=tuanlda78202/geminio" /></a>
</a>