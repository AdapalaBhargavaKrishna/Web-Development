import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { auth, db, doc, getDoc, setDoc } from '../firebase/firebase';
import cancellogo from '../assets/cancel.svg';
import fallbackImg from '../assets/fallback-img.jpg';
import imdblogo from '../assets/imdb.svg';
import deletelogo from '../assets/delete.svg';
import freshlogo from '../assets/fresh.svg';
import rottenlogo from '../assets/rotten.svg';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    const fetchWatchlist = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const watchlistIDs = userDoc.data().watchlist || [];
          if (watchlistIDs.length > 0) {
            const movieDetails = await Promise.all(
              watchlistIDs.map(async (id) => {
                const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
                return await response.json();
              })
            );
            setWatchlist(movieDetails);
          } else {
            setWatchlist([]);
          }
        } else {
          console.log("User document not found");
          setWatchlist([]);
        }
      } else {
      toast.warning("User is not logged in");
        setWatchlist([]);
      }
      setLoading(false);
    };
    fetchWatchlist();
  }, [apiKey]);

  const removeFromWatchlist = async (imdbID) => {
    const user = auth.currentUser;
    if (!user) {
      toast.warning("User is not logged in");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      let watchlistIDs = userDoc.data().watchlist || [];
      watchlistIDs = watchlistIDs.filter((movieID) => movieID !== imdbID);

      await setDoc(userDocRef, { watchlist: watchlistIDs }, { merge: true });
      toast.info('Movie removed from your Watchlist');
      
      setSelectedMovie(null)
      
      setWatchlist((prev) => prev.filter((movie) => movie.imdbID !== imdbID));
    } else {
      console.log("User document not found");
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();
    setSelectedMovie(data);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 text-white gap-4 relative">

      <h2 className="text-center inline-flex bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text font-bold md:text-4xl text-3xl text-transparent">
        Your Watchlist
      </h2>

      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70">
          <div className="md:m-0 m-4 relative w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-800 p-[1px] backdrop-blur-3xl">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <div className="relative z-10 flex flex-col items-center md:flex-row gap-6 bg-gray-950 rounded-3xl p-6 shadow-lg">
              <img src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : fallbackImg} alt={selectedMovie.Title} className="w-60 h-auto md:rounded-md rounded-lg object-contain shadow-md" />
              <div className='flex flex-col'>
                <img src={cancellogo} onClick={() => setSelectedMovie(null)} className='cursor-pointer w-7 h-7 absolute right-4 top-4' alt="" />
                <h2 className="text-center inline-flex bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text font-bold md:text-4xl text-3xl text-transparent my-4">{selectedMovie.Title}</h2>
                <p className="text-slate-400 mb-2"><b>Year:</b> {selectedMovie.Year}</p>
                <p className="text-slate-400 mb-2"><b>Genre:</b> {selectedMovie.Genre}</p>
                <p className="text-slate-400 mb-2"><b>Plot:</b> {selectedMovie.Plot}</p>
                <p className="text-slate-400 mb-2"><b>Director:</b> {selectedMovie.Director}</p>
                <p className="text-slate-400 mb-2"><b>Actors:</b> {selectedMovie.Actors}</p>

                <div className='flex gap-10 mt-4 items-center'>
                  {selectedMovie.Ratings && selectedMovie.Ratings.length > 0 && (
                    selectedMovie.Ratings.map(rating => {
                      if (rating.Source === 'Rotten Tomatoes') {
                        const percentage = parseInt(rating.Value.replace('%', ''));
                        return (
                          <div key={rating.Source} className='flex gap-2 items-center'>
                            <img src={percentage >= 60 ? freshlogo : rottenlogo} className='w-5 h-5' alt={percentage >= 60 ? 'Fresh' : 'Rotten'} />
                            <p className="text-slate-400">{rating.Value}</p>
                          </div>
                        );
                      }
                      return null;
                    })
                  )}
                  <div className='flex gap-2 items-center'>
                    <img src={imdblogo} className='w-5 h-5' alt="IMDB" />
                    <p className="text-slate-400">{selectedMovie.imdbRating}</p>
                  </div>
                </div>

                <div className='flex items-center justify-start mt-4'>
                  <button onClick={() => removeFromWatchlist(selectedMovie.imdbID)} className="group active:scale-95 animate-background-shine relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(110deg,transparent,45%,#ff1000,55%,transparent)] bg-[length:200%_100%] px-6 font-medium text-gray-400 transition-colors focus:outline-none">
                    <div className="translate-y-0 opacity-100 transition group-hover:-translate-y-[150%] group-hover:opacity-0">Remove from Watch List</div>
                    <div className="absolute translate-y-[150%] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                      <img src={deletelogo} alt="" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-center h-[70vh] w-full overflow-y-auto mt-10">
        {loading && (
          <span className="animate-background-shine1 bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text md:text-xl text-lg text-transparent md:mt-5 mt-20">
            Loading your watchlist...
          </span>
        )}

        {!loading && watchlist.length === 0 && (
          <span className="animate-background-shine2 bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text md:text-xl text-2xl text-center text-transparent md:mt-5 mt-20">
            Your watchlist is empty!
          </span>
        )}

        {!loading && watchlist.length > 0 && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full ml-7 px-4">
            {watchlist.map((movie) => (
              <div
                key={movie.imdbID}
                onClick={() => fetchMovieDetails(movie.imdbID)}
                className="flex flex-col md:ml-0 items-center m-5 border p-4 w-72 rounded-3xl border-gray-800 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : fallbackImg}
                  alt={movie.Title}
                  className="w-56 h-56 object-contain rounded-md shadow-lg"
                />
                <h2 className="flex mt-2 animate-text-gradient bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-xl text-transparent">
                  {movie.Title}
                </h2>
                <p className="bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text text-transparent">
                  {movie.Year} | {movie.Type}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
