import "./App.css";
import { useState } from "react";

function App() {
  const [currentImage, setCurrentImage] = useState(undefined);
  const [loading, setLoading] = useState(false);

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
      <h1 style={{ marginTop: 0 }}>Clique nos botões para gerar imagens</h1>
      {loading ?
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/cd514331234507.564a1d2324e4e.gif"
          className="image-conainer"
          style={{ boxShadow: 'none' }}
        /> :
        <>
          {currentImage ? (
            <img
              src={currentImage}
              className="image-conainer"
            />
          ) : (
            <img
              src="https://thumbs.gfycat.com/HeartfeltOrderlyIrishredandwhitesetter.webp"
              className="image-conainer"
              style={{ boxShadow: 'none' }}
            />
          )}
        </>
      }

      
      <div className="buttons-container">
        <button onClick={() => fetchCats()} className="button" style={{ marginRight: 12, backgroundColor: '#d9a7c7' }}>
          Gerar um gato
        </button>
        <button onClick={() => fetchDogs()} className="button" style={{ backgroundColor: '#7ceeac' }}>
          Gerar um cachorro
        </button>
      </div>
    </div>
  );
}

export default App;
