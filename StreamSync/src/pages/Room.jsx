import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import copysvg from '../assets/copy.svg';
import userssvg from '../assets/users.svg';
import usersvg from '../assets/user.svg';
import playsvg from '../assets/playw.svg';
import hostsvg from '../assets/host.svg';
import searchsvg from '../assets/search.svg';
import linksvg from '../assets/link.svg';
import { useTheme } from '../context/ThemeContext.jsx'
import { useState } from 'react';

const Room = () => {
  const { roomId } = useParams();
  const { isDark, toggleTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [searchInput, setSearchInput] = useState(true);
  const [searchVideos, setSearchVideos] = useState([]);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState('');
  const [youtubeSearch, setYoutubeSearch] = useState('');

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const fetchYouTubeVideos = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          youtubeSearch
        )}&type=video&maxResults=10&key=${API_KEY}`
      );
      const data = await res.json();
      console.log(data.items);
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

  const toEmbedURL = (youtubeURL) => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = youtubeURL.trim().match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const playerOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  const handlePlayerReady = (event) => {
    console.log("Player Ready");
  };

  const handleStateChange = (event) => {
    console.log("State Changed", event.data);
  };

  const toggleSearchInput = (val) => {
    setSearchInput(val);
    setSearchVideos([]);
  }

  return (
    <div className='bg-purple-50 dark:bg-neutral-950 min-h-screen'>
      <nav className="bg-white dark:bg-black flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-4 dark:border-zinc-800 transition-colors duration-300">
        <div className="text-center sm:text-left mb-3 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-white">
            Room <span className="text-purple-500">{roomId}</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">1 user watching</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-zinc-800 dark:text-white rounded-lg text-sm hover:scale-105 transition">
            <img src={copysvg} alt="" className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Code"}
          </button>

          <button className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg text-sm hover:scale-105 transition font-medium">
            Exit
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 text-zinc-800 dark:text-white hover:scale-105 transition"
            aria-label="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7 flex flex-col lg:flex-row gap-5 lg:gap-8 xl:gap-20'>
        <div className='w-full lg:w-3/4 rounded-lg'>
          <div className='bg-white rounded-lg shadow-xl h-[40vh] sm:h-[50vh] md:h-[58vh]'>
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

          <div className='bg-white/85 rounded-xl p-5 sm:p-7 mt-5'>
            <h1 className='font-semibold text-lg'>Add YouTube Video</h1>
            <div className='flex gap-2 mt-2 flex-wrap'>
              <button
                onClick={() => toggleSearchInput(true)}
                className='rounded-lg px-2 py-[0.4rem] font-semibold text-sm items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white bg-neutral-200 gap-2 flex'>
                <img src={searchsvg} className='w-4 h-4' alt="" />
                <span className="hidden sm:inline">Search Youtube</span>
                <span className="sm:hidden">Search</span>
              </button>
              <button
                onClick={() => toggleSearchInput(false)}
                className='rounded-lg px-2 py-[0.4rem] font-semibold text-sm items-center bg-neutral-200 text-black gap-2 flex'>
                <img src={linksvg} className='w-4 h-4' alt="" />
                <span className="hidden sm:inline">YouTube URL</span>
                <span className="sm:hidden">URL</span>
              </button>
            </div>

            {searchInput ? (
              <div className='relative mt-4 w-full'>
                <img
                  src={searchsvg}
                  alt=""
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 invert'
                />
                <input
                  type="text"
                  placeholder="Search YouTube Videos..."
                  value={youtubeSearch}
                  onChange={(e) => setYoutubeSearch(e.target.value)}
                  className='w-full pl-10 pr-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
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
                  src={searchsvg}
                  alt=""
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 invert'
                />
                <input
                  type="text"
                  placeholder="Enter YouTube URL..."
                  value={youtubeURL}
                  onChange={(e) => setYoutubeURL(e.target.value)}
                  className='w-full pl-10 pr-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <button
                  onClick={() => setYoutubeVideo(youtubeURL)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-md text-sm transition"
                >
                  Add Video
                </button>
              </div>
            )}

            {searchVideos.length > 0 &&
              <div className='bg-white mt-4 p-4 border rounded-lg'>
                <h1>Search Results</h1>
                <ul className='p-2 space-y-3 max-h-[40vh] overflow-y-auto'>
                  {searchVideos.map((video) => (
                    <li
                      key={video.id.videoId}
                      onClick={() => setYoutubeVideo(`https://www.youtube.com/watch?v=${video.id.videoId}`)}
                      className='flex gap-3 cursor-pointer hover:bg-neutral-100 p-2 rounded-lg transition'
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
                        <h5 className="font-medium text-sm line-clamp-2 mb-1 text-gray-900">
                          {video.snippet.title}
                        </h5>
                        <p className="text-xs text-gray-600">{video.snippet.channelTitle}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            }
          </div>
        </div>

        <div className='w-full lg:w-1/4 bg-white rounded-lg pb-8 px-5 max-h-min overflow-y-auto order-first lg:order-last'>
          <div className='sticky top-0 bg-white z-10 flex items-center gap-2 p-4 pt-5 lg:pt-8'>
            <img src={userssvg} alt="" />
            <p className='font-medium text-zinc-700'>Users (1)</p>
          </div>

          <div className='mt-4'>
            <ul className='space-y-4 max-h-[40vh] sm:max-h-[52vh] overflow-y-auto'>
              <li className='flex items-center gap-2 bg-neutral-50 p-2 rounded-xl'>
                <img src={usersvg} className='p-2 bg-blue-400 rounded-full' alt="" />
                Bhargava 
                <img src={hostsvg} alt="" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;