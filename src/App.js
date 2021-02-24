import "./App.css";
import { useState } from "react";
import { timeoutPromise, retry } from "./utils/promise-helpers.js";
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
    retry(1, 3000, () => timeoutPromise(200, fetchAnimal("dog")))
      .then((total) => EventEmitter.emit("animalColetado", total))
      .catch(console.log)
  );

  const actionCat = operations(() =>
    retry(1, 3000, () => timeoutPromise(200, fetchAnimal("cat")))
      .then((total) => EventEmitter.emit("animalColetado", total))
      .catch(console.log)
  );

  const fetchAnimal = async (animal) => {
    try {
      setLoading(true);
      const result = await fetch(
        animal === "dog"
          ? "https://dog.ceo/api/breeds/image/random"
          : "https://aws.random.cat/meow"
      );
      const parsedResult = await result.json();
      animal === "dog"
        ? setCurrentImage(parsedResult.message)
        : setCurrentImage(parsedResult.file);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="container">
      <h1 style={{ marginTop: 0 }}>Clique nos botões para gerar imagens</h1>
      {loading ? (
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/cd514331234507.564a1d2324e4e.gif"
          className="image-conainer"
          style={{ boxShadow: "none" }}
          alt="gifDogCat"
        />
      ) : (
        <>
          {currentImage ? (
            <img
              src={currentImage}
              className="image-conainer"
              alt="imageLoaded"
            />
          ) : (
            <img
              src="https://thumbs.gfycat.com/HeartfeltOrderlyIrishredandwhitesetter.webp"
              className="image-conainer"
              style={{ boxShadow: "none" }}
              alt="gitLoading"
            />
          )}
        </>
      )}

      <div className="buttons-container">
        <button
          onClick={actionCat}
          className="button"
          style={{ marginRight: 12, backgroundColor: "#d9a7c7" }}
        >
          Gerar um gato
        </button>
        <button
          onClick={action}
          className="button"
          style={{ backgroundColor: "#7ceeac" }}
        >
          Gerar um cachorro
        </button>
      </div>
    </div>
  );
}

export default App;
