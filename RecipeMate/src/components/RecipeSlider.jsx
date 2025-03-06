import React, {useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Draggable } from "gsap/all";

const RecipeSlider = ({onSelectMeal}) => {

  const [recipes, setRecipes] = useState([]);

  useEffect(() =>{
    const fetchRandomRecipes = async () => {
      let fetchedRecipes = [];
      for (let i = 0; i < 10; i++) {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        const data = await response.json();
        if(data.meals){
          fetchedRecipes.push({
            id: data.meals[0].idMeal,
            title: data.meals[0].strMeal,
            img: data.meals[0].strMealThumb,
          });
        }

      }
      setRecipes(fetchedRecipes);
    };
    fetchRandomRecipes();
  }, [])

  const settings = {
    infinite: true,
    speed: 400,
    slidesToShow: 2,  
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    draggable: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Try These Recipes!</h2>
      <Slider {...settings}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="px-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center h-full"
              onClick={() => onSelectMeal(recipe.id)}
            >
              <img 
              src={recipe.img} 
              alt={recipe.title} 
              className="w-full h-80 object-cover object-center rounded-md"
              />
              <h3 className="mt-4 text-lg font-semibold">{recipe.title}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecipeSlider;
