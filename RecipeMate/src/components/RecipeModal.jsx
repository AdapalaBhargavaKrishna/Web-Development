import React from 'react'
import gsap from "gsap";

const RecipeModal = ({meal, onClose}) => {
    if (!meal) return null;
   
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
        <div className="bg-[#f8fbff] pl-6 pr-6 pt-4 rounded-lg shadow-lg w-[80vw] h-[90vh] relative">
          <div className="flex">
          <div id="left" className='w-1/2 m-2 rounded-xl'>
          <div className=" shadow-md p-4 rounded-xl flex flex-col items-center bg-blue-50">

            <img onClick={onClose} className='absolute top-3 right-3 text-xl' src="/img/close.svg" alt="" />
            <h2 className="text-2xl font-bold">{meal.strMeal}</h2>
            <p className="text-gray-500">Category: {meal.strCategory}</p>
            <div className="flex justify-center">
            <img src={meal.strMealThumb} alt={meal.strMeal} className='w-full h-60 object-cover rounded-md mt-4'/>
            </div>
          </div>
            <div className='bg-blue-50 max-h-64 overflow-y-auto overflow-hidden hide-scrollbar mt-4 rounded-lg shadow-md p-2'>
            <h2 className="mb-4 text-xl font-bold">Ingredients:</h2>
            <ul className="list-disc pl-5 space-y-1 ">
            {Array.from({length: 20}, (_,i) => i + 1)
                .map(i => meal[`strIngredient${i}`] && <li key = {i}>{meal[`strIngredient${i}`]}</li>)}
            </ul>
            </div>
          </div>
          <div id="right" className='w-1/2 m-2 rounded-xl max-h-[38.5rem] shadow-md p-2 pl-10 pr-10 bg-blue-50 overflow-y-auto overflow-hidden hide-scrollbar'>
            <h1 className="mt-4 font-bold text-xl mb-2 text-center">Instructions:</h1>
            <p className="text-sm">{meal.strInstructions.split()}</p>
          </div>
          </div>
          {meal.strYoutube && (
                <div className="mt-4 bg-red-200 max-h-20 rounded-lg shadow-md p-2">
                    <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch Youtube Video Tutorial</a>
                </div>
            )}
        </div>
    </div>
  )
}

export default RecipeModal
