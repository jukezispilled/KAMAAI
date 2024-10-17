import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Tracker from './Tracker';
import Log from './log';
import { Window, WindowContent, WindowHeader } from 'react95';
import { ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [lastResponses, setLastResponses] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamedText, setCurrentStreamedText] = useState('');
  const controls = useAnimation();
  const chatRef = useRef(null);
  const audioRef = useRef(new Audio('song.mp3')); // Reference for audio
  const [currentImage, setCurrentImage] = useState('diddy.png');

  const specificResponses = {
    ca: ['CA? You must be referring to California!'],
    twitterx: [
      <span>
        Check it out <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-blue-500">here</a>!
      </span>,
    ],
    tg: [
      <span>
        Join the fun <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="text-blue-500">here</a>!
      </span>,
    ],
  };

  const generalResponses = [
    "ain't no party like a diddy party",
    'oil up.',
    'you after party ass',
    "you ain't put in enough work yet g",
    'nigga biebs was mine for 24 stfu lil nigga',
    "can't do that but I am a freak.",
    'meek call me daddy thats what',
    'nigga',
    'you need $20?',
    'ask JLO',
    'nigga say that to beyonce',
    'future niggaai CEO *mic drop*',
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

    for (let i = 0; i <= response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Control the typing speed
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
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prevImage => (prevImage === 'diddy.png' ? 'diddy2.jpeg' : 'diddy.png'));
    }, 5000);

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

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

  const MatrixBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = Array(columns).fill(canvas.height);
      const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";

      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = matrix[Math.floor(Math.random() * matrix.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      const intervalId = setInterval(draw, 33);

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: -30 }} />
    );
  };

  // Function to handle play/pause audio
  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  // Inside your component
  const initialMessageRef = useRef(false);

  useEffect(() => {
    const initialMessage = "DIDDYAI v6.9";
    
    // Check if the initial message has already been streamed
    if (!initialMessageRef.current) {
      initialMessageRef.current = true; // Mark as streamed
      streamAIResponse(initialMessage);
    }
  }, []);

  return (
    <ThemeProvider theme={original}>
      <div className="min-h-screen w-screen relative flex flex-col items-center overflow-hidden font-mono">
        <MatrixBackground />
        <div className='fixed inset-0 w-full h-full'>
          <img src="meek.gif" className='w-[40%] absolute -bottom-[20px] left-0 z-[-20]'></img> {/* Set z-index to -20 */}
          <img src="bieb.gif" className='w-[40%] absolute -bottom-[35px] right-0 z-[-20]'></img>
        </div>
        
        {/* Play/Pause Image */}
        <img 
          src="music.png" // Replace with your image source
          alt="Play/Pause"
          className="absolute size-32 -top-2 -left-2 hidden md:flex cursor-pointer z-50" 
          onClick={toggleAudio} 
        />

        <div className='text-center pt-[15px]'>
          <Window>
            <span className='text-xs md:text-base'>CA: updating..</span>
          </Window>
        </div>

        <div className="w-full px-4 mt-8 z-20"> {/* Set z-index to 20 for the chat and window */}
          <div className="w-[75%] md:w-[25%] mx-auto mb-4">
            <Window>
              <WindowHeader>
                DIDDYAI
              </WindowHeader>
              <WindowContent style={{ padding: '0' }}>
                <img src={currentImage} alt="Diddy" />
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
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#0f0] text-white p-2"
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
          powered by <a href="https://openai.com/"><img src="open.svg" className='size-12 md:size-20'></img></a>
        </div>

        {/* Floating Image Animation */}
        <motion.img
          src="forget.png"
          alt="Forget"
          className="fixed left-1/2 transform -translate-x-1/2 w-[65vw] md:w-[35vw] z-50"
          style={{ bottom: '0' }}
          initial={{ y: '100%' }}
          animate={controls}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;