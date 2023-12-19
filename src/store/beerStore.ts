import { signal } from '@preact/signals-react';

const FAV_BEERS_KEY = 'favouriteBeers';

const createBeerStore = () => {
  const storedBeer = localStorage.getItem(FAV_BEERS_KEY);
  const favourites = storedBeer ? JSON.parse(storedBeer) : [];
  const favouriteBeers = signal<string[]>(favourites);

  const addFavourite = (beerId: string) => {
    const newFavourites = [...favouriteBeers.value, beerId];
    localStorage.setItem(FAV_BEERS_KEY, JSON.stringify(newFavourites));
    favouriteBeers.value = newFavourites;
  };

  const removeFavourite = (beerId: string) => {
    const newFavourites = favouriteBeers.value.filter((id: string) => id !== beerId);
    localStorage.setItem(FAV_BEERS_KEY, JSON.stringify(newFavourites));
    favouriteBeers.value = newFavourites;
  }

  const toggleFavourite = (beerId: string) => {
    const isFavourite = favouriteBeers.value.includes(beerId);
    if (isFavourite) {
      removeFavourite(beerId);
    } else {
      addFavourite(beerId);
    }
  }

  const deleteAll = () => {
    localStorage.removeItem(FAV_BEERS_KEY);
    favouriteBeers.value = [];
  }

  return {
    favouriteBeers,
    addFavourite,
    deleteAll,
    removeFavourite,
    toggleFavourite,
  };
};

export const beerStore = createBeerStore();
