import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const foodItems = [
  { id: 1, name: "Rice", calories: 200, group: "Grains", image: "/images/Rice.jpg" },
  { id: 2, name: "Dal", calories: 150, group: "Protein", image: "/images/dal.jpg" },
  { id: 3, name: "Roti", calories: 100, group: "Grains", image: "/images/roti.jpg" },
  { id: 4, name: "Paneer", calories: 250, group: "Dairy", image: "/images/panner.jpg" },
  { id: 5, name: "Chicken", calories: 300, group: "Protein", image: "/images/chicken.jpg" },
  { id: 6, name: "Curd", calories: 80, group: "Dairy", image: "/images/curd.jpg" },
  { id: 7, name: "Apple", calories: 95, group: "Fruits", image: "/images/APPLE.png" },
  { id: 8, name: "Banana", calories: 105, group: "Fruits", image: "/images/banana.jpg" },
  { id: 9, name: "Orange", calories: 62, group: "Fruits", image: "/images/orange.jpg" },
  { id: 10, name: "Salad", calories: 130, group: "Fruits", image: "/images/salad.jpg" },
];

const DraggableFood = ({ food }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FOOD",
    item: food,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="food-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={food.image} alt={food.name} className="food-image" />
      <p>{food.name} ({food.calories} cal)</p>
    </div>
  );
};

const Plate = ({ onDrop, onRemove, selectedFoods }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FOOD",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="plate" style={{ backgroundColor: isOver ? "lightgreen" : "white" }}>
      <h2>Plate</h2>
      {selectedFoods.map((food, index) => (
        <div key={food.id} className="plate-item">
          <img src={food.image} alt={food.name} className="plate-image" />
          <p>{food.name} ({food.calories} cal)</p>
          <button onClick={() => onRemove(food)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [age, setAge] = useState(18);
  const [neededCalories, setNeededCalories] = useState(700);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [foodGroupsUsed, setFoodGroupsUsed] = useState(new Set());

  const calculateCalories = (age) => (age < 18 ? 600 : age < 30 ? 700 : 800);

  const handleAgeChange = (event) => {
    const newAge = parseInt(event.target.value, 10);
    setAge(newAge);
    setNeededCalories(calculateCalories(newAge));
    setSelectedFoods([]);
    setFoodGroupsUsed(new Set());
  };

  const handleDrop = (food) => {
    setSelectedFoods((prevFoods) => {
      if (prevFoods.some((f) => f.id === food.id)) return prevFoods; // Prevent duplicates
      return [...prevFoods, food];
    });

    setFoodGroupsUsed((prevGroups) => {
      const newGroups = new Set(prevGroups);
      newGroups.add(food.group);
      return newGroups;
    });
  };

  const handleRemove = (food) => {
    setSelectedFoods((prevFoods) => {
      const updatedFoods = prevFoods.filter((f) => f.id !== food.id);
      const updatedGroups = new Set(updatedFoods.map((f) => f.group));
      setFoodGroupsUsed(updatedGroups);
      return updatedFoods;
    });
  };

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0);
  const allGroupsUsed = ["Grains", "Protein", "Dairy", "Fruits"].every((group) => foodGroupsUsed.has(group));

  const isBalancedMeal =
    totalCalories >= neededCalories - 50 &&
    totalCalories <= neededCalories + 50 &&
    allGroupsUsed;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <h1>Balanced Lunch Game</h1>
        <label>Enter your age: </label>
        <input type="number" value={age} onChange={handleAgeChange} />
        <h2>Needed Calories: {neededCalories}</h2>
        <h2>Current Calories: {totalCalories}</h2>
        <h2>Food Groups Used: {foodGroupsUsed.size}/4</h2>
        <div className="food-list">
          {foodItems.map((food) => (
            <DraggableFood key={food.id} food={food} />
          ))}
        </div>
        <Plate onDrop={handleDrop} onRemove={handleRemove} selectedFoods={selectedFoods} />
        {isBalancedMeal && <h2 style={{ color: "green" }}>Great! You made a balanced meal!</h2>}
      </div>
    </DndProvider>
  );
};

export default App;
