import "./App.css";
import { useState } from "react";
// app/app.js
import { timeoutPromise, retry } from "./utils/promise-helpers.js";
import "./utils/array-helpers.js";
import {
  takeUntil,
  debounceTime,
  partialize,
  pipe,
} from "./utils/operators.js";
import { EventEmitter } from "./utils/event-emitter.js";

function App() {
  const [currentImage, setCurrentImage] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const operations = pipe(
    partialize(takeUntil, 3),
    partialize(debounceTime, 500)
  );

  const action = operations(() =>
    retry(3, 3000, () => timeoutPromise(200, fetchDogs()))
      .then((total) => EventEmitter.emit("itensTotalizados", total))
      .catch(console.log)
  );

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const result = await fetch("https://dog.ceo/api/breeds/image/random");
      const parsedResult = await result.json();

      if (parsedResult.status === "success") {
        setCurrentImage(parsedResult.message);
        setLoading(false);
      } else {
        alert("aconteceu algo de errado com o seu request 😔");
      }
    } catch (error) {
      alert(error);
    }
  };

  const fetchCats = async () => {
    try {
      setLoading(true);
      const result = await fetch("https://aws.random.cat/meow");
      const parsedResult = await result.json();
      setCurrentImage(parsedResult.file);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container">
      <div className="App">
        <button onClick={() => action()} className="buttonCat">
          Gerar um gato
        </button>
        <button onClick={() => action()} className="buttonDog">
          Gerar um cachorro
        </button>
      </div>

      <span>{loading ? "carregando ..." : null}</span>

      {currentImage ? (
        <img
          src={currentImage}
          alt="animalimage"
          width="400px"
          height="400px"
        />
      ) : (
        <img
          alt="seta"
          src="https://image.flaticon.com/icons/png/512/130/130864.png"
          width="400px"
          height="400px"
        />
      )}
    </div>
  );
}

export default App;
