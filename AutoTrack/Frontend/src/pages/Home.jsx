import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import API from '../api'
import { motion } from 'framer-motion'
import { useUser } from '../data/UserContext'
import { useNavigate } from 'react-router-dom';
import CircularProgress from '../components/CircularProgress';
import youtubelogo from '../assets/svg/youtube.svg'
import studysvg from '../assets/svg/study.svg'
import linksvg from '../assets/svg/link.svg'
import magicsvg from '../assets/svg/arroww.svg'
import booksvg from '../assets/svg/book.svg'
import cardsvg from '../assets/svg/cards.svg'
import playsvg from '../assets/svg/play.svg'
import historysvg from '../assets/svg/history.svg'
import firesvg from '../assets/svg/fire.svg'
import usersvg from '../assets/svg/user.svg'
import completesvg from '../assets/svg/complete.svg'
import completewsvg from '../assets/svg/completew.svg'

const Home = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate()

  const [videoUrl, setVideoUrl] = useState('')
  const [completePer, setCompletePer] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false);
  const [completedVideos, setCompletedVideos] = useState(0)
  const [watchedVideos, setWatchedVideos] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)
  const [latestVideo, setLatestVideo] = useState({
    title: '',
    author: '',
    thumbnail: '',
    date: '',
    time: '',
    videoUrl: '',
    iscomlpleted: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user._id) {
        navigate("/");
        return;
      }

      try {
        const res = await API.get(`/user/${user._id}`);
        const videosFromDB = res.data.user.videos || [];

        setUser(prev => ({
          ...prev,
          history: [...videosFromDB],
        }));

        updateProgress(res.data.user.videos);

        console.log(res.data.user.videos)
      } catch (err) {
        console.error('Error fetching user from DB:', err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateProgress = (videos) => {
    const completed = videos.filter(v => v.isCompleted).length;
    const total = videos.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;

    setCompletePer(percent);
    setCompletedVideos(completed);
    setWatchedVideos(total);
  };


  const testVideoUrl = (url) => {
    return url.includes('youtube.com/watch') || url.includes('youtu.be/')
  }

  const fetchVideoDetails = async (url) => {
    if (!testVideoUrl(url)) return;
    setLatestVideo({
      title: '',
      author: '',
      thumbnail: '',
      date: '',
      time: '',
      videoUrl: '',
      iscomlpleted: false,
    })

    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodedUrl}&format=json`)

      const data = await response.json();

      const newVideo = {
        title: data.title,
        author: data.author_name,
        thumbnail: data.thumbnail_url,
        date: new Date().toLocaleDateString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        videoUrl: url,
        isCompleted: false,
      };

      const res = await API.post(`user/${user._id}/add-video`, newVideo)

      setUser(prev => ({
        ...prev,
        history: res.data.videos,
      }))
      setLatestVideo(newVideo);

      updateProgress(res.data.videos);
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTranscript = async () => {
    if (!testVideoUrl(videoUrl)) return;
    setLoading(true);

    try {
      const encodedUrl = encodeURIComponent(videoUrl);
      const response = await fetch(`https://youtube-transcript3.p.rapidapi.com/api/transcript-with-url?url=${encodedUrl}&flat_text=true&lang=en`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com',
            'x-rapidapi-key': 'd35e47d289mshcaa95f9768d61d4p1fdb41jsn86b99a932737',
          },
        },
      );

      const data = await response.json();
      setTranscript(data.transcript)
      // console.log(data.transcript)
      fetchVideoDetails(videoUrl)

    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const markAsComplete = async () => {
    try {
      const res = await API.put(`/user/${user._id}/mark-complete`, {
        videoUrl: latestVideo.videoUrl
      });
      setLatestVideo(prev => ({
        ...prev,
        isCompleted: true
      }))
      const updatedVideos = res.data.videos;
      setUser(prev => ({
        ...prev,
        history: updatedVideos,
      }))

      updateProgress(res.data.videos);


    } catch (err) {
      console.error("Mark complete error", err)
    }
  }

  return (
    <>
      <Navbar item={"Dashboard"} />
      <div className='bg-[#f4f9ff] min-h-screen font-sans text-gray-800'>
        <div className='flex flex-col items-center max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-14 pt-20 pb-10'>
          <h1 className='text-2xl sm:text-3xl md:text-[3.1rem] pb-4 leading-snug font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Welcome {user && user.name}!
          </h1>

          <p className='text-neutral-600 text-sm sm:text-base md:text-lg my-3 mx-auto max-w-2xl'>
            Paste any YouTube URL to get AI-powered summaries, flashcards, and track your learning journey
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 bg-white p-4 rounded-xl w-full max-w-2xl shadow-md transition duration-200 hover:shadow-lg'>
            <img src={youtubelogo} className='w-10 h-10' alt="YouTube Logo" />
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder='Paste YouTube URL here'
              className='w-full sm:w-[70%] p-2 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-200'
            />
            <button
              onClick={fetchTranscript}
              disabled={loading}
              className='flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm whitespace-nowrap shadow-lg hover:scale-105 transition'>
              <img src={magicsvg} className='w-4 h-4' alt="Magic Icon" />
              <p>{loading ? "Fetching..." : "Analyze"}</p>
            </button>
          </div>
          <p className='text-sm text-neutral-400 mt-2'>Supports YouTube videos with available transcripts</p>
        </div>

        {latestVideo.title &&
          <div className='flex flex-col w-[65%] mx-auto bg-white shadow-md items-center rounded-xl overflow-hidden'>
            <div className='w-full relative'>
              <img src={latestVideo.thumbnail} className='w-full h-64 object-cover rounded-xl' alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
              <div className='absolute right-0 bottom-0 left-0 text-white p-4'>
                <h1 className='text-lg font-semibold'>{latestVideo.title}</h1>
                <div className='flex items-center gap-1 text-sm text-gray-300'>
                  <img src={usersvg} className='w-4 h-4' alt="User" />
                  <span>{latestVideo.author}</span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between bg-neutral-50 p-5 w-full'>
              <div className='flex'>
                <button className='flex items-center gap-2 mx-4 bg-blue-100 text-blue-600 rounded-xl font-semibold p-2'><img src={booksvg} alt="" /><span>Summary</span></button>
                <button className='flex items-center gap-2 mx-4 text-purple-600'><img src={cardsvg} alt="" /><span>Flashcards</span></button>
              </div>
              <div className='flex'>
                <a href={latestVideo.videoUrl} target='_blank' className='flex items-center gap-2 mx-4'><img className='w-8 h-8' src={playsvg} alt="" /><span>Watch Video</span></a>

                <button onClick={markAsComplete}
                  className={`flex items-center gap-2 mx-4 ${latestVideo.isCompleted ? 'bg-green-100 text-[#16a34a]' : 'bg-green-500'}  text-white rounded-xl font-semibold p-2`}><img className='w-5 h-5' src={latestVideo.isCompleted ? completesvg : completewsvg} alt="" /><span>{latestVideo.isCompleted ? "Completed" : "Mark Complete"}</span></button>
              </div>
            </div>
            <div className='p-5 space-y-7'>
              <div>
                <h1 className='font-bold text-xl text-purple-700'>AI Summary</h1>
                <p className='text-gray-700'>This video covers key concepts related to Match The Voice To The Person. The main topics discussed include important principles, practical applications, and actionable insights that viewers can apply. The content provides valuable information for learners looking to understand this subject matter more deeply.</p>
              </div>
              <div>
                <h1 className='font-bold text-xl text-purple-700'>Key Points</h1>
                <ul className='list-disc pl-5 space-y-1'>
                  <li className='[&::marker]:text-blue-600'>Understanding the fundamental concepts</li>
                  <li className='[&::marker]:text-blue-600'>Practical applications and examples</li>
                  <li className='[&::marker]:text-blue-600'>Best practices and recommendations</li>
                  <li className='[&::marker]:text-blue-600'>Common mistakes to avoid</li>
                  <li className='[&::marker]:text-blue-600'>Next steps for further learning</li>
                </ul>
              </div>
            </div>
          </div>
        }


        <div className='flex mx-52'>
          <div className='p-4 space-y-5'>
            <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col  items-center gap-4'>
              <h1 className='font-bold text-xl'>Learning Progress</h1>
              <div className='flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 p-2 rounded-lg shadow-md transition duration-200 hover:shadow-lg w-2/4'>
                <img src={firesvg} className='w-10 h-10' alt="" />
                <div className='text-center'>
                  <h1 className='font-bold text-2xl'>{user?.history?.length || 0}</h1>
                  <p>My Streak</p>
                </div>
              </div>
              <div className='p-6 px-24'>
                <CircularProgress completionRate={completePer} />
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col  items-center gap-4'>
              <div className='flex items-center gap-2'>
                <img src={historysvg} className='w-8 h-8' alt="" />
                <h1 className='font-bold text-xl'>Videos Watched</h1>
              </div>
              <div className='text-center'>
                <h1 className='font-bold text-2xl'>{watchedVideos}</h1>
                <p className='text-base text-neutral-500'>{completedVideos} Completed</p>
              </div>
            </div>
          </div>

          <div className='m-4 bg-white rounded-xl shadow-md w-[65%] '>
            <div className='p-5'>
              <h1 className='font-bold text-xl'>Recent Learning</h1>
              <p className='text-base text-neutral-500'>Your Latest video summaries</p>
            </div>
            <hr className='mb-4' />

            <div className='space-x-2 overflow-y-scroll overflow-x-hidden max-h-96'>

              {user.history && user.history.map((video, index) => (

                <motion.div key={index} className='rounded-lg'
                  onClick={() => setLatestVideo(video)}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.01, }}
                  transition={{ duration: 0.4 }}

                >
                  <div className='flex'>
                    <img src={video.thumbnail} className='h-24 rounded-3xl object-cover p-4' alt="" />

                    <div className='space-y-2 relative'>
                      <img src={completesvg} className={`${video.isCompleted ? "" : "hidden"} top-0 right-4 absolute w-7 h-7`} alt="" />
                      <h1 className='font-semibold text-sm md:text-base'>
                        {video.title}
                      </h1>

                      <div className='flex gap-6 text-neutral-500 text-base'>
                        <h1 className='flex items-center gap-1'>
                          <img src={usersvg} className='w-4 h-4' alt="" />
                          <span>{video.author}</span>
                        </h1>
                        <p>{video.time}</p>
                      </div>

                      <p className='text-xs text-gray-700 line-clamp-2'>
                        This video covers key concepts related to Match The Voice To The Person. The main topics discussed include important principles, practical applications, and actionable insights...
                      </p>

                      <div className='flex gap-3 pt-1'>
                        <span className='rounded-full shadow text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1'>
                          5 key points
                        </span>
                        <span className='rounded-full shadow text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-1'>
                          3 flashcards
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className='my-8' />
                </motion.div>

              ))}

              {user.history && user.history.length === 0 &&
                <div className='flex flex-col items-center justify-between max-w-6xl w-full mt-7 bg-white rounded-xl p-20 space-y-2 shadow-lg'>
                  <img src={linksvg} alt="" />
                  <h1 className='font-semibold text-xl text-neutral-500'>No Learning History</h1>
                  <p className='text-base text-neutral-500'>Start by analyzing your first YouTube video</p>
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Home
