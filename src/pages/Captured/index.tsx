import { FC, useEffect, useState } from "react";
import NavBar from "../NavBar";

const navigation = [
  { name: "Pokemon List", href: "/", current: false },
  { name: "Captured", href: "/captured", current: true },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CapturedPokemon: FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [capturedPokemon, setCapturedPokemon] = useState<
    { name: string; nickname: string; captureTime: string; imageUrl: string }[]
  >([]);

  useEffect(() => {
    const fetchCapturedPokemon = () => {
      const capturedPokemonData: {
        name: string;
        nickname: string;
        captureTime: string;
        imageUrl: string;
      }[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key !== "debugger") {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            try {
              const { nickname, captureTime, imageUrl } =
                JSON.parse(storedData);
              capturedPokemonData.push({
                name: key,
                nickname: nickname,
                captureTime: captureTime,
                imageUrl: imageUrl,
              });
            } catch (error) {
              console.error(`Error parsing localStorage item '${key}':`, error);
            }
          }
        }
      }

      setCapturedPokemon(capturedPokemonData);
    };

    fetchCapturedPokemon();
  }, []);

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

  const filteredPokemon = capturedPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={classNames("bg-white", darkMode ? "dark" : "light")}>
      <NavBar
        darkMode={darkMode}
        navigation={navigation}
        toggleSearch={toggleSearch}
        toggleDarkMode={toggleDarkMode}
        isSearchOpen={isSearchOpen}
      />

      {/* CapturedPokemon content goes here */}

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
        <h1 className="text-2xl font-semibold mb-4">Captured Pokemon</h1>
        {capturedPokemon.length === 0 ? (
          <p>No Pokémon captured yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPokemon.map((pokemon, index) => (
              <li
                key={index}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out ${
                  darkMode ? "dark-card" : ""
                }`}
              >
                <div className="block p-4">
                  <img
                    src={pokemon.imageUrl} // Use captured imageUrl here
                    alt={pokemon.name}
                    className="mx-auto"
                    style={{ height: 96, width: 96 }}
                    onError={(e) =>
                      console.error(
                        `Error loading image for '${pokemon.name}':`,
                        e
                      )
                    }
                  />
                  <p className="text-xl font-semibold text-center capitalize">
                    {pokemon.name}
                  </p>
                  <p className="text-center">Nickname: {pokemon.nickname}</p>
                  {pokemon.captureTime && (
                    <p className="text-center">
                      Captured at: {pokemon.captureTime}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CapturedPokemon;
