import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";

const navigation = [
  { name: "Pokemon List", href: "/", current: true },
  { name: "Captured", href: "/captured", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const PokemonList = () => {
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [nickname, setNickname] = useState<string>("");
  const [captureTime, setCaptureTime] = useState<string>("");
  const [pokemonList, setPokemonList] = useState<
    { name: string; imageUrl: string }[]
  >([]);
  const [pokemonNamesSet, setPokemonNamesSet] = useState<Set<string>>(
    new Set()
  );
  const [capturedPokemon, setCapturedPokemon] = useState<
    { name: string; nickname: string; captureTime: string; imageUrl: string }[]
  >([]);

  useEffect(() => {
    fetchData(limit, offset);
  }, [limit, offset]);

  const fetchData = async (limit: number, offset: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      const promises = response.data.results.map(
        async (pokemon: { url: string; name: string }) => {
          const res = await axios.get(pokemon.url);
          const { id } = res.data;
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return {
            name: pokemon.name,
            imageUrl: imageUrl,
          };
        }
      );

      const pokemonWithData = await Promise.all(promises);

      const uniquePokemon = pokemonWithData.filter((pokemon) => {
        if (!pokemonNamesSet.has(pokemon.name)) {
          setPokemonNamesSet((prevSet) => new Set(prevSet.add(pokemon.name)));
          return true;
        }
        return false;
      });

      if (uniquePokemon.length > 0) {
        setPokemonList((prevPokemonList) => [
          ...prevPokemonList,
          ...uniquePokemon,
        ]);
      }

      if (pokemonList.length >= 150) {
        setOffset(-1);
      } else {
        setOffset(offset + limit);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (loading || offset === -1) return;
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      fetchData(limit, offset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [limit, offset, loading]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prevState) => !prevState);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePokemonClick = (pokemon: any) => {
    setSelectedPokemon(pokemon);
    setCaptureTime(new Date().toLocaleString());
  };

  const handleTagAsCaptured = () => {
    if (selectedPokemon && nickname.trim() !== "") {
      const captureDateTime = new Date().toLocaleString();
      localStorage.setItem(
        selectedPokemon.name,
        JSON.stringify({
          nickname,
          captureTime: captureDateTime,
          imageUrl: selectedPokemon.imageUrl, // Store image URL in localStorage
        })
      );

      const newCapturedPokemon = {
        name: selectedPokemon.name,
        nickname: nickname,
        captureTime: captureDateTime,
        imageUrl: selectedPokemon.imageUrl, // Also store image URL in state
      };

      setCapturedPokemon((prevCapturedPokemon) => [
        ...prevCapturedPokemon,
        newCapturedPokemon,
      ]);

      setSelectedPokemon(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  useEffect(() => {
    if (selectedPokemon) {
      const storedNickname = localStorage.getItem(selectedPokemon.name);
      if (storedNickname) {
        const { nickname, captureTime, imageUrl } = JSON.parse(storedNickname);
        setNickname(nickname);
        setCaptureTime(captureTime);
        setSelectedPokemon({ ...selectedPokemon, imageUrl }); // Update selectedPokemon with imageUrl
      } else {
        setNickname("");
      }
    }
  }, [selectedPokemon]);

  return (
    <div className={classNames("bg-white", darkMode ? "dark" : "light")}>
      <NavBar
        darkMode={darkMode}
        navigation={navigation}
        toggleSearch={toggleSearch}
        toggleDarkMode={toggleDarkMode}
        isSearchOpen={isSearchOpen}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {isSearchOpen && (
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Pokemon..."
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
            />
          </div>
        )}
        <h1 className="text-2xl font-semibold mb-4">All Pokemon</h1>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPokemon.map((pokemon) => (
              <div
                key={pokemon.name}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out ${
                  darkMode ? "dark-card" : ""
                }`}
                onClick={() => handlePokemonClick(pokemon)}
              >
                <div className="block p-4">
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="mx-auto"
                    style={{ height: 96, width: 96 }}
                  />
                  <p className="text-xl font-semibold text-center capitalize">
                    {pokemon.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {selectedPokemon && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-96 relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <img
                  src={selectedPokemon.imageUrl}
                  alt={selectedPokemon.name}
                  className="mx-auto"
                  style={{ height: 96, width: 96 }}
                />
                <p className="text-xl font-semibold text-center capitalize">
                  {selectedPokemon.name}
                </p>
                <p className="text-center">
                  Details about {selectedPokemon.name}
                </p>
                <input
                  type="text"
                  placeholder="Enter nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="mt-4 p-2 border rounded w-full"
                />
                <p className="text-center mt-2">Captured at: {captureTime}</p>
                <button
                  onClick={handleTagAsCaptured}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-full"
                >
                  Tag as Captured
                </button>
              </div>
            </div>
          )}

          {capturedPokemon.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold">Pokémon Captured:</h2>
              <ul className="mt-4">
                {capturedPokemon.map((pokemon, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">{pokemon.name}</span> -{" "}
                    <span>{pokemon.nickname}</span> (Captured at{" "}
                    {pokemon.captureTime})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading Pokemon...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonList;
