import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Tracker from './Tracker';
import Log from './log';
import { Window, WindowContent, WindowHeader } from 'react95';
import { ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import MatrixBackground from './Matrix';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [lastResponses, setLastResponses] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamedText, setCurrentStreamedText] = useState('');
  const controls = useAnimation();
  const chatRef = useRef(null);
  const audioRef = useRef(new Audio('https://ia801008.us.archive.org/17/items/celebrategoodtimes...comeon/Celebrate%20Good%20Times...%20Come%20on%21%21%21.mp3'));

  const specificResponses = {
    ca: ['soon...'],
    twitterx: [
      <span>
        Check it boy <a href="https://x.com/cocoaicoin" target="_blank" rel="noopener noreferrer" className="text-blue-500">here</a>!
      </span>,
    ],
    tg: [
      <span>
        Look nigga <a href="https://t.me/cocoaiportal" target="_blank" rel="noopener noreferrer" className="text-blue-500">here</a>!
      </span>,
    ],
  };

  const generalResponses = [
    "that's great and thank you for that, but we need to be there for eachother, that's it",
    "I know what it's like to be from the hood, shit I used to be a nigg...neighbor",
    "that doesn't matter, what does matter is a united america",
    "the brotha's will be showing out I can promise you that",
    "we need things to get done that need to get done so we can get it done",
    "look nigga",
    "niggaz everywhere love me. you could call me top nigga",
    "stop that, just make sure you vote blue",
    "all I know is how much love I have for my brothas and sistas",
    "p diddy was just an acquaintence and nothing more",
    "just look at my skin, I'm with y'all folks. we are gonna win no matter what it is",
    "my main job is just to keep y'all distracted while my masters...recalculating...hey y'all",
  ];

  const getAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    let aiResponse;

    if (lowerInput.includes('ca')) {
      const responses = specificResponses.ca;
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerInput.includes('twitter') || lowerInput.includes('x')) {
      const responses = specificResponses.twitterx;
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerInput.includes('telegram') || lowerInput.includes('tg')) {
      const responses = specificResponses.tg;
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    } else {
      aiResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    while (lastResponses.includes(aiResponse)) {
      aiResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    return aiResponse;
  };

  const streamAIResponse = async (response) => {
    setIsStreaming(true);
    setCurrentStreamedText('');

    const chunkSize = 3;
    for (let i = 0; i <= response.length; i += chunkSize) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setCurrentStreamedText(response.slice(0, i));
    }

    setIsStreaming(false);
    setChatHistory(prev => [...prev, { text: response, sender: 'ai' }]);
    setLastResponses(prev => {
      const newResponses = [...prev, response];
      if (newResponses.length > 4) newResponses.shift();
      return newResponses;
    });
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isStreaming) {
      const userMessage = message.trim();
      setChatHistory(prev => [...prev, { text: userMessage, sender: 'user' }]);
      setMessage('');

      const response = getAIResponse(userMessage);
      await streamAIResponse(response);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    const animateImage = async () => {
      await controls.start({
        y: ['100%', '0%', '100%'],
        transition: { duration: 2.5, ease: "easeInOut" },
      });
    };

    const interval = setInterval(() => {
      animateImage();
    }, 9000);

    animateImage();
    return () => clearInterval(interval);
  }, [controls]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory, currentStreamedText]);

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const initialMessageRef = useRef(false);

  useEffect(() => {
    const initialMessage = "Hey y'all! Especially y'all brothers and sisters";
    
    if (!initialMessageRef.current) {
      initialMessageRef.current = true;
      streamAIResponse(initialMessage);
    }
  }, []);

  return (
    <ThemeProvider theme={original}>
      <div className="min-h-screen w-screen relative flex flex-col items-center overflow-hidden font-mono">
        <MatrixBackground />
        
        <img 
          src="music.png"
          alt="Play/Pause"
          className="absolute size-32 -top-2 -left-2 hidden md:flex cursor-pointer z-50" 
          onClick={toggleAudio} 
        />

        <div className='text-center pt-[15px]'>
          <Window>
            <span className='text-xs md:text-base'>CA: uploading</span>
          </Window>
        </div>

        <div className="w-full px-4 mt-8 z-20">
          <div className="w-[75%] md:w-[25%] mx-auto mb-4">
            <Window>
              <WindowHeader>
                COCOAI
              </WindowHeader>
              <WindowContent style={{ padding: '0' }}>
                <img src="coco.png" alt="COCO" />
              </WindowContent>
            </Window>
          </div>
          <div className="flex justify-center w-full">
            <div className="w-[300px] md:w-[600px] lg:w-[800px] flex flex-col">
              <div
                ref={chatRef}
                className="border border-gray-300 p-4 h-80 overflow-auto bg-zinc-800 flex flex-col"
              >
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`p-2 my-1 rounded-lg ${
                      chat.sender === 'user'
                        ? 'bg-gray-300 self-end'
                        : 'bg-gray-100 self-start'
                    } max-w-[80%]`}
                  >
                    {chat.text}
                  </div>
                ))}
                {isStreaming && (
                  <div className="p-2 my-1 rounded-lg bg-gray-100 self-start max-w-[80%]">
                    {currentStreamedText}
                  </div>
                )}
              </div>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border border-gray-300 p-2 flex-1 bg-zinc-800 outline-none caret-white text-white"
                  placeholder="Type message or 'twitter'/'telegram'/'ca'"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#00AEF3] text-white p-2"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='h-min py-[10%] w-screen flex justify-center items-center'>
          <Log />
        </div>
        <div className='h-min pt-[15%] pb-[25%] md:pt-[5%] md:pb-[10%] w-screen flex justify-center items-center'>
          <Tracker />
        </div>

        <div className='min-h py-[10px] w-screen flex justify-center items-center text-white gap-4'>
          powered by <a href="https://openai.com/"><img src="open.svg" className='size-12 md:size-20' alt="OpenAI Logo" /></a>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;