import React from 'react'
import gsap from "gsap";

const RecipeModal = ({meal, onClose}) => {
    if (!meal) return null;
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-400 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative">
            <button onClick={onClose} className='absolute top-3 right-3 text-xl'>✖</button>
            <h2 className="text-2xl font-bold">{meal.strMeal}</h2>
            <p className="text-gray-500">{meal.strCategory}</p>
            <img src={meal.strMealThumb} alt={meal.strMeal} className='w-full h-60 object-cover rounded-md mt-4'/>
            <h3 className="mt-4 font-bold">Ingredients:</h3>
            <ul className="list-disc pl-5">
                {Array.from({length: 20}, (_,i) => i + 1)
                .map(i => meal[`strIngredient${i}`] && <li key = {i}>{meal[`strIngredient${i}`]}</li>)}
            </ul>
            <h3 className="mt-4 font-bold">Instructions:</h3>
            <p className="text-sm">{meal.strInstructions}</p>
            {meal.strYoutube && (
                <div className="mt-4">
                    <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch Youtube Video Tutorial</a>
                </div>
            )}
        </div>
    </div>
  )
}

export default RecipeModal
