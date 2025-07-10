import YouTube from 'react-youtube';
import { motion } from 'framer-motion';
import copysvg from '../assets/copy.svg';
import deletesvg from '../assets/delete.svg';
import exitsvg from '../assets/exit.svg';
import cancelsvg from '../assets/cancel.svg';
import removesvg from '../assets/remove.svg';
import lightModeIcon from '../assets/lightmode.svg';
import darkModeIcon from '../assets/darkmode.svg';
import userssvg from '../assets/users.svg';
import hostsvg from '../assets/host.svg';
import searchsvg from '../assets/search.svg';
import linksvg from '../assets/link.svg';
import chatsvg from '../assets/chat.svg';

export const VideoPlayer = ({ youtubeVideo, handlePlayerReady, handleStateChange, isHost }) => {
  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url?.trim().match(regex);
    return match?.[1] || '';
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="w-full rounded-lg"
    >
      <div className='bg-white dark:bg-neutral-800 rounded-lg shadow-xl h-[40vh] sm:h-[50vh] md:h-[58vh] overflow-hidden'>
        <YouTube
          videoId={extractVideoId(youtubeVideo) || 'dQw4w9WgXcQ'}
          onReady={handlePlayerReady}
          onStateChange={(e) => handleStateChange(e, isHost)}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: { autoplay: 0 },
          }}
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
};