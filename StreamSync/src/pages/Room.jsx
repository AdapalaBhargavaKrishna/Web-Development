import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import copysvg from '../assets/copy.svg';
import userssvg from '../assets/users.svg';
import usersvg from '../assets/user.svg';
import hostsvg from '../assets/host.svg';
import searchsvg from '../assets/search.svg';
import linksvg from '../assets/link.svg';
import chatsvg from '../assets/chat.svg';
import API from '../api.jsx';
import io from 'socket.io-client';
import { useTheme } from '../context/ThemeContext.jsx';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const [roomData, setRoomData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'chat', 'users'
  const [searchVideos, setSearchVideos] = useState([]);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState('');
  const [youtubeSearch, setYoutubeSearch] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [isHost, setIsHost] = useState(localStorage.getItem('isHost') === 'true');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const messagesEndRef = useRef(null);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Socket connection
  useEffect(() => {
    socket.current = io('http://localhost:5000');
    const username = localStorage.getItem('username');
    socket.current.emit('joinRoom', { roomId, user: username });

    socket.current.on('chatMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.current.emit('leaveroom', { roomId, user: username });
      socket.current.disconnect();
    };
  }, [roomId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const username = localStorage.getItem('username');
    const message = {
      user: username,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.current.emit('chatMessage', { roomId, message });
    setMessageInput('');
  };

  const fetchYouTubeVideos = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          youtubeSearch
        )}&type=video&maxResults=10&key=${API_KEY}`
      );
      const data = await res.json();
      setSearchVideos(data.items || []);
    } catch (error) {
      console.error("YouTube Search Error:", error);
    }
  };

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url?.trim().match(regex);
    return match?.[1] || '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayerReady = (event) => {
    console.log("Player Ready");
  };

  const handleStateChange = (event) => {
    console.log("State Changed", event.data);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await API.get(`/rooms/${roomId}`);
        setRoomData(res.data.room);
      } catch (error) {
        console.error("Error fetching room data:", error);
        alert("Failed to fetch room data. Please try again.");
        navigate('/');
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  const handleExitConfirm = async () => {
    const username = localStorage.getItem('username');
    const roomCode = localStorage.getItem('roomCode');

    try {
      if (isHost) {
        await API.delete(`/rooms/${roomCode}`);
      } else {
        await API.post('/rooms/leave', {
          roomId: roomCode,
          name: username
        });
      }

      localStorage.removeItem('username');
      localStorage.removeItem('isHost');
      localStorage.removeItem('roomCode');

      navigate('/');
    } catch (error) {
      console.error("Error leaving room:", error);
      alert("Failed to leave the room. Please try again.");
    }
  };

  return (
    <div className='bg-purple-50 dark:bg-neutral-950 min-h-screen'>
      <nav className="bg-white dark:bg-black flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-4 dark:border-zinc-800 transition-colors duration-300">
        <div className="text-center sm:text-left mb-3 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-white">
            Room <span className="text-purple-500">{roomId}</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">({roomData?.users?.length || 0}) user watching</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-zinc-800 dark:text-white rounded-lg text-sm hover:scale-105 transition">
            <img src={copysvg} alt="" className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Code"}
          </button>

          <button
            onClick={() => setShowExitModal(true)}
            className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg text-sm hover:scale-105 transition font-medium">
            Exit
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 text-zinc-800 dark:text-white hover:scale-105 transition"
            aria-label="Toggle theme"
          >
            {isDark ? "☀" : "☽"}
          </button>
        </div>
      </nav>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7 flex flex-col gap-5'>
        {/* Video Player - Always visible */}
        <div className='w-full rounded-lg'>
          <div className='bg-white dark:bg-neutral-800 rounded-lg shadow-xl h-[40vh] sm:h-[50vh] md:h-[58vh]'>
            <div className='w-full h-full rounded-xl overflow-hidden'>
              <YouTube
                videoId={extractVideoId(youtubeVideo) || 'dQw4w9WgXcQ'}
                onReady={handlePlayerReady}
                onStateChange={handleStateChange}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                  },
                }}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden sticky top-16 z-10 bg-white dark:bg-black border-b dark:border-zinc-800">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 ${activeTab === 'search' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}
            >
              <img src={searchsvg} className="w-5 h-5" alt="Search" />
              <span className="text-sm font-medium">Search</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}
            >
              <img src={chatsvg} className="w-5 h-5" alt="Chat" />
              <span className="text-sm font-medium">Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 flex items-center justify-center gap-2 ${activeTab === 'users' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}
            >
              <img src={userssvg} className="w-5 h-5" alt="Users" />
              <span className="text-sm font-medium">Users</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className='flex flex-col lg:flex-row gap-5 lg:gap-8'>
          {/* Search Section */}
          <div className={`w-full ${activeTab === 'search' ? 'block' : 'hidden'} lg:block lg:w-2/3 bg-white/85 dark:bg-neutral-800/90 rounded-xl p-5 sm:p-7`}>
            <h1 className='font-semibold text-lg dark:text-white mb-4'>Add YouTube Video</h1>
            <div className='flex gap-2 mt-2 flex-wrap'>
              <button
                onClick={() => setActiveTab('search')}
                className={`rounded-lg px-3 py-2 font-semibold text-sm items-center gap-2 flex ${activeTab === 'search' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white'}`}>
                <img src={searchsvg} className='w-4 h-4' alt="" />
                <span>Search Youtube</span>
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`rounded-lg px-3 py-2 font-semibold text-sm items-center gap-2 flex ${activeTab === 'url' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white'}`}>
                <img src={linksvg} className='w-4 h-4' alt="" />
                <span>YouTube URL</span>
              </button>
            </div>

            {activeTab === 'search' ? (
              <div className='relative mt-4 w-full'>
                <img
                  src={searchsvg}
                  alt=""
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:invert'
                />
                <input
                  type="text"
                  placeholder="Search YouTube Videos..."
                  value={youtubeSearch}
                  onChange={(e) => setYoutubeSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchYouTubeVideos()}
                  className='w-full pl-10 pr-24 p-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <button
                  onClick={fetchYouTubeVideos}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-md text-sm transition"
                >
                  Search
                </button>
              </div>
            ) : (
              <div className='relative mt-4 w-full'>
                <img
                  src={linksvg}
                  alt=""
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:invert'
                />
                <input
                  type="text"
                  placeholder="Enter YouTube URL..."
                  value={youtubeURL}
                  onChange={(e) => setYoutubeURL(e.target.value)}
                  className='w-full pl-10 pr-24 p-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <button
                  onClick={() => setYoutubeVideo(youtubeURL)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-md text-sm transition"
                >
                  Add Video
                </button>
              </div>
            )}

            {searchVideos.length > 0 && (
              <div className='bg-white dark:bg-neutral-700 mt-4 p-4 border dark:border-neutral-600 rounded-lg'>
                <h1 className="dark:text-white mb-2">Search Results</h1>
                <ul className='space-y-3 max-h-[40vh] overflow-y-auto custom-scroll'>
                  {searchVideos.map((video) => (
                    <motion.li
                      key={video.id.videoId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setYoutubeVideo(`https://www.youtube.com/watch?v=${video.id.videoId}`)}
                      className='flex gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 p-2 rounded-lg transition'
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          className="w-24 sm:w-32 h-16 sm:h-20 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          YouTube
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm line-clamp-2 mb-1 text-gray-900 dark:text-white">
                          {video.snippet.title}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{video.snippet.channelTitle}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar - Chat and Users */}
          <div className={`w-full lg:w-1/3 flex flex-col gap-5 ${activeTab !== 'search' ? 'block' : 'hidden'} lg:block`}>
            {/* Users Panel */}
            <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow ${activeTab === 'users' ? 'block' : 'hidden'} lg:block`}>
              <div className='sticky top-0 bg-white dark:bg-neutral-800 z-10 flex items-center gap-2 p-4 border-b dark:border-neutral-700'>
                <img src={userssvg} alt="" className="dark:invert" />
                <p className='font-medium text-zinc-700 dark:text-white'>Users ({roomData?.users?.length || 0})</p>
              </div>

              <div className='overflow-y-auto max-h-[30vh] p-4 custom-scroll'>
                {roomData?.users?.length > 0 ? (
                  <ul className='grid gap-3'>
                    {roomData.users.slice(0, 3).map((user, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-700 p-3 rounded-xl shadow-sm"
                      >
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold text-lg shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-zinc-800 dark:text-white font-medium flex-1">{user.name}</span>
                        {user.isHost && (
                          <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                            <img src={hostsvg} alt="host" className="w-4 h-4" />
                            Host
                          </span>
                        )}
                      </motion.li>
                    ))}
                    {roomData.users.length > 3 && (
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        + {roomData.users.length - 3} more users
                      </div>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 px-4">No users in this room.</p>
                )}
              </div>
            </div>

            {/* Chat Panel */}
            <div className={`bg-white dark:bg-neutral-800 rounded-lg shadow flex-1 flex flex-col ${activeTab === 'chat' ? 'block' : 'hidden'} lg:block`}>
              <div className='sticky top-0 bg-white dark:bg-neutral-800 z-10 flex items-center gap-2 p-4 border-b dark:border-neutral-700'>
                <img src={chatsvg} alt="" className="dark:invert" />
                <p className='font-medium text-zinc-700 dark:text-white'>Live Chat</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-zinc-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-lg px-3 py-2 w-fit max-w-[90%] ${msg.user === localStorage.getItem('username')
                          ? 'ml-auto bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-zinc-800 dark:text-white'
                        }`}
                    >
                      <p className="text-xs font-semibold">{msg.user}</p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-[11px] text-right text-zinc-500 dark:text-zinc-400 mt-1">{msg.time}</p>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-neutral-800 p-4 border-t dark:border-neutral-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 text-sm border border-zinc-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {isHost ? "Delete Room?" : "Leave Room?"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {isHost
                  ? "Are you sure you want to delete this room? This will remove all users and cannot be undone."
                  : "Are you sure you want to leave this room? You can rejoin later if you have the room code."}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExitConfirm}
                  className={`px-4 py-2 rounded-lg text-white ${isHost ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'} transition`}
                >
                  {isHost ? "Delete Room" : "Leave Room"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default Room;