import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokemonList from "./pages/PokemonList";

import CapturedPokemon from "./pages/Captured";

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/captured" element={<CapturedPokemon />} />
      </Routes>
    </Router>
  );
};

export default App;
