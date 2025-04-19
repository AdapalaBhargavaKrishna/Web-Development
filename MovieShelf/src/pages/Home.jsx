import React, { useState } from 'react';
import { toast } from 'sonner';
import searchlogo from '../assets/search.svg';
import imdblogo from '../assets/imdb.svg';
import rottenlogo from '../assets/rotten.svg'
import freshlogo from '../assets/fresh.svg'
import cancellogo from '../assets/cancel.svg'
import addlogo from '../assets/add.svg'
import fallbackImg from '../assets/fallback-img.jpg'
import { auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, db, setDoc, doc, getDoc } from '../firebase/firebase';

const Home = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSelectedMovie(null);

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`);
      const data = await response.json();
      setMovies(data.Response !== 'False' ? data.Search : []);
      
    } catch (error) {
      toast.error('Error fetching movies:', error);
      setMovies([]);
    }
    setLoading(false);
    setQuery('');
  };

  const fetchMovieDetails = async (imdbID) => {
    setDetailsLoading(true)

    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      toast.error('Error fetching movies:', error);
    }
    setDetailsLoading(false);
  }

  const addToWatchlist = async (movie) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please log in first!');
      return;
    }
  
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
  
    if (userDoc.exists()) {
      const watchlist = userDoc.data().watchlist || [];
      
      const isMovieInWatchlist = watchlist.some(item => item === movie.imdbID);
      
      if (isMovieInWatchlist) {
        toast.warning('Movie is already in the watchlist');
        return;
      }
      if (!isMovieInWatchlist) {
        watchlist.push(movie.imdbID);
        await setDoc(userDocRef, { watchlist }, { merge: true });
        toast.success('Movie Successfully Added to Your Watchlist', {
          description: 'You can view it anytime in your Watchlist.',
        });        
      }
    } else {
      await setDoc(userDocRef, {
        watchlist: [movie.imdbID],
      });
      console.log("New user document created, movie added to watchlist");
    }
  };
  
  

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-20 text-white gap-4">
        <h2 className="text-center inline-flex bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text font-bold md:text-4xl text-3xl text-transparent">
          Explore Popular Movies & Shows
        </h2>
        <span className="inline-flex animate-background-shine1 bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text md:text-lg text-base text-transparent">
          Enter a movie title to begin your journey
        </span>

        <div className="relative w-72">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border-1 block h-12 w-full rounded-md border border-double border-slate-800 border-transparent bg-[linear-gradient(#000,#000),linear-gradient(to_right,#334454,#334454)] bg-origin-border px-3 py-2 text-slate-200 transition-all duration-500 [background-clip:padding-box,_border-box] placeholder:text-slate-500 focus:bg-[linear-gradient(#000,#000),linear-gradient(to_right,#c7d2fe,#8678f9)] focus:outline-none"
            placeholder="Search Movies & Shows here"
          />
          <img className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer" src={searchlogo} alt="Search" onClick={handleSearch} />
        </div>
      </div>

      <div className="text-white flex items-start justify-center h-[55vh] w-full overflow-y-auto mt-10">

        {loading && (
          <span className="flex h-11 animate-text-gradient bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text md:text-4xl text-2xl text-transparent mt-20">
            Loading...
          </span>
        )}


        {!loading && selectedMovie && !detailsLoading && (
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
                            <img
                              src={percentage >= 60 ? freshlogo : rottenlogo}
                              className='w-5 h-5'
                              alt={percentage >= 60 ? 'Fresh' : 'Rotten'} />
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
                  <button onClick={() => addToWatchlist(selectedMovie)} className="group active:scale-95 animate-background-shine relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(110deg,transparent,45%,#1e2631,55%,transparent)] bg-[length:200%_100%] px-6 font-medium text-gray-400 transition-colors focus:outline-none">
                    <div className="translate-y-0 opacity-100 transition group-hover:-translate-y-[150%] group-hover:opacity-0">Add to Watch List</div>
                    <div className="absolute translate-y-[150%] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                      <img src={addlogo} alt="" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !selectedMovie && movies.length > 0 && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full ml-7 px-4">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                onClick={() => fetchMovieDetails(movie.imdbID)}
                className="flex flex-col md:ml-0 items-center m-5 border p-4 w-72 rounded-3xl border-gray-800 cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <img src={movie.Poster !== 'N/A' ? movie.Poster : fallbackImg} alt={movie.Title} className="w-56 h-56 object-contain rounded-md shadow-lg" />
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

        {!loading && !selectedMovie && movies.length === 0 && query.trim() !== '' && (
          <span className="animate-background-shine2 bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text md:text-xl text-2xl text-center text-transparent md:mt-5 mt-20">
            No movies found! Try another title.
          </span>
        )}

        {!loading && !selectedMovie && movies.length === 0 && query.trim() === '' && (
          <span className="animate-background-shine2 bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text md:text-xl text-lg text-transparent md:mt-40 mt-20">
            Enter a movie title to begin your journey
          </span>
        )}
      </div>


    </>
  );
};

export default Home;
