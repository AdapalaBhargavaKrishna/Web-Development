import React, { useEffect } from "react";
import gsap from "gsap";

const RecipeModal = ({ meal, onClose }) => {
  if (!meal) return null;

  useEffect(() => {
    
    gsap.fromTo('.ani', {
      opacity: 0, scale: 0
    },
  {
    opacity: 1, 
    scale: 1, 
    duration: 1.2, 
    ease: "power2.out",
    stagger: 0.3
  })
  }, [])
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
        <div className="bg-[#f8fbff] md:pl-6 md:pr-6 pl-2 pr-2 pt-4 rounded-lg shadow-lg w-[90vw] md:w-[80vw] h-[95vh] md:h-[90vh] relative overflow-y-auto hide-scrollbar ">
        <img onClick={onClose} className='absolute top-3 right-3 text-xl' src="/img/close.svg" alt=""/>
          <div className="flex md:flex-row flex-col">
          <div id="left" className='flex flex-col  md:w-1/2 m-2 rounded-xl'>

          {/* babba1 */}
          <div className=" shadow-md p-4 rounded-xl flex flex-col items-center bg-blue-50 md:mt-0 mt-3 ani">
            <h2 className="text-2xl font-bold">{meal.strMeal}</h2>
            <p className="text-gray-500">Category: {meal.strCategory}</p>
            <div className="flex justify-center">
            <img src={meal.strMealThumb} alt={meal.strMeal} className='w-full h-60 object-cover rounded-md mt-4'/>
            </div>

            {/* dabba2 */}
          </div>
            <div className='bg-blue-50 max-h-64 overflow-y-auto overflow-hidden hide-scrollbar mt-4 rounded-lg shadow-md p-2 ani'>
            <h2 className="flex items-center justify-center mb-4 text-xl font-bold">Ingredients:</h2>
            <ul className="list-disc pl-5 space-y-1 ">
            {Array.from({length: 20}, (_,i) => i + 1)
                .map(i => meal[`strIngredient${i}`] && <li key = {i}>{meal[`strIngredient${i}`]}</li>)}
            </ul>
            </div>
          </div>

          {/* dabba3 */}
          <div id="right" className='md:w-1/2 m-2 rounded-xl max-h-[38.5rem] shadow-md p-2 md:pl-10 pl-5 pr-5 md:pr-10 bg-blue-50 overflow-y-auto hide-scrollbar ani'>
            <h1 className="mt-4 font-bold text-xl mb-2 text-center">Instructions:</h1>
            <p className="text-sm">{meal.strInstructions.split()}</p>
          </div>
          </div>

          {/* dabba4 */}
          {meal.strYoutube && (
                <div className="md:mt-4 mt-2 md:mb-0 mb-4 bg-red-200 max-h-20 rounded-lg shadow-md p-2 flex justify-center items-center ani">
                    <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">🎥 Watch Youtube Video Tutorial</a>
                </div>
            )}
        </div>
    </div>
  )
}

export default RecipeModal
