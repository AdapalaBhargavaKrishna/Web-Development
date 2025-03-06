import React, { useState, useEffect, useRef } from 'react'
import RecipeSlider from './RecipeSlider'
import RecipeModal from './RecipeModal'
import gsap from "gsap";

const Search = () => {

  const [searchResults, setSearchResults] = useState([]);
  const [selectMeal, setSelectMeal] = useState(null);
  const searchRef = useRef(null);
  const sliderRef = useRef(null);
  
  const fetchRecipes = async (query) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
    const data = await response.json()

    setSearchResults(data.meals || []);
  };

  const fetchMealDetails = async (id) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    setSelectMeal(data.meals[0]);
  }

  const handleSearch = () => {
    const query = searchRef.current.value.trim().replace(/\s/g, "_");
    if (!query) return;
    
    gsap.to(sliderRef.current, {opacity: 0, y: -50, duration: 0.5, display: "none"});
    gsap.to("#searchbar", {y: 0, duration: 0.5, onComplete: () => {
      document.getElementById("searchbar").classList.remove("mb-28");
      document.getElementById("searchbar").classList.add("mb-4");
    }})

    fetchRecipes(query);
    searchRef.current.value = "";
  }

  return (
    <div id="search" className='w-full h-screen flex items-center flex-col bg-blue-50'>
      <h1 className='mt-12 font-extrabold text-2xl md:text-7xl'>Discover the PERFECT RECIPE</h1>
      <div id="slider" ref={sliderRef} className='w-full h-3/5 md:h-screen p-5 md:p-10'>
      <RecipeSlider onSelectMeal={fetchMealDetails} />
      </div>
      <div id="searchbar" className='flex flex-col md:flex-row gap-3 items-center mb-28 mt-5'>
        <h4 className='font-semibold'>Enter Main Ingredient</h4>
        <div id="searchbtn" className='relative flex items-center'>
          <input
            ref={searchRef}
            type="text"
            placeholder='     Search'
            className='bg-white text-gray-700 p-3 pl-5 pr-12 rounded-full shadow-md w-72 focus:outline-none'
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <img
            src="/img/search.svg"
            alt="Search"
            className='absolute right-0 p-2 bg-white rounded-2xl cursor-pointer hover:bg-gray-600 transition-all'
            onClick={handleSearch}
          />
        </div>
      </div>
      {searchResults.length > 0 && (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6 p-8 overflow-y-auto hide-scrollbar w-4/5 h-[75vh] mb-1 ">
          {searchResults.map((meal) => (
            <div key={meal.idMeal} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300"
              onClick={() => fetchMealDetails(meal.idMeal)}
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-60 object-cover rounded-md" />
              <h3 className="mt-4 text-lg font-semibold">{meal.strMeal}</h3>
            </div>
          ))}
        </div>
      )}

      {selectMeal && <RecipeModal meal = {selectMeal} onClose={() => setSelectMeal(null)} />}
    </div>
  );
};

export default Search;
