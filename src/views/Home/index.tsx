import FavIconSelected from '@mui/icons-material/Favorite';
import {
  Button,
  Checkbox,
  IconButton,
  Link,
  Paper,
  TextField,
  Tooltip,
} from '@mui/material';
import { computed, effect, signal } from '@preact/signals-react';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { beerStore } from '../../store';
import { Beer } from '../../types';
import styles from './Home.module.css';
import FavLoadingIndicator from './LoadingIndicator';
import { fetchBeerListById, fetchData } from './utils';

const isLoading = signal(false);
const beerById = signal<Record<string, Beer>>({});

const Home = () => {
  const [searchText, setSeachText] = useState('');
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [forceRefreshKey, setForceRefreshKey] = useState<string | undefined>();
  const { favouriteBeers, deleteAll, removeFavourite } = beerStore;

  useEffect(() => {
    fetchData(forceRefreshKey).then((resonse) => {
      if (resonse) {
        setBeerList(resonse);
      }
    });
  }, [forceRefreshKey]);

  const refreshRandomList = useCallback(() => {
    setForceRefreshKey(Math.random().toString(36));

    setSeachText('');
  }, []);

  const handleOnFilterChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setSeachText(ev.target.value);
    },
    [],
  );

  effect(async () => {
    if (isLoading.value) return;
    const beerIds = favouriteBeers.value;
    const unfetchedBeerIds = computed(() =>
      beerIds.filter((id) => beerById.value[id] === undefined),
    );
    if (unfetchedBeerIds.value.length > 0) {
      isLoading.value = true;
      const beers = await fetchBeerListById(beerIds);
      if (beers) {
        beers.forEach((beer) => {
          beerById.value[beer.id] = beer;
        });
      }
      isLoading.value = false;
    }
  });

  const filteredBeerList = useMemo(
    () =>
      searchText
        ? beerList.filter((beer) =>
            beer.name.toLowerCase().includes(searchText.toLowerCase()),
          )
        : beerList,
    [beerList, searchText],
  );

  return (
    <article>
      <section>
        <main>
          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <TextField
                  label="Filter..."
                  variant="outlined"
                  onChange={handleOnFilterChange}
                  value={searchText}
                />
                <Button variant="contained" onClick={refreshRandomList}>
                  Reload list
                </Button>
              </div>
              <ul className={styles.list}>
                {filteredBeerList.length ? (
                  filteredBeerList.map((beer, index) => (
                    <li key={index.toString()}>
                      <Checkbox />
                      <Link component={RouterLink} to={`/beer/${beer.id}`}>
                        {beer.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <FavLoadingIndicator entryCount={10} />
                )}
              </ul>
            </div>
          </Paper>

          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3>Favourites</h3>
                <Button variant="outlined" size="small" onClick={deleteAll}>
                  Remove all items
                </Button>
              </div>
              <ul className={styles.list}>
                {!isLoading.value &&
                  favouriteBeers.value.map((beerId) => {
                    const beer = beerById.value[beerId];
                    return (
                      <li key={beerId}>
                        <Tooltip title="Remove from favourite">
                          <IconButton
                            onClick={removeFavourite.bind(this, beer.id)}
                          >
                            <FavIconSelected />
                          </IconButton>
                        </Tooltip>
                        <Link component={RouterLink} to={`/beer/${beer.id}`}>
                          {beer.name}
                        </Link>
                      </li>
                    );
                  })}
                {!isLoading.value && !favouriteBeers.value.length && (
                  <p>No saved items</p>
                )}
                {/* `||` is intentional here (instead of `??`) because we want to show at least 1 row of loading indicator. */}
                {isLoading.value && (
                  <FavLoadingIndicator
                    entryCount={favouriteBeers.value.length || 1}
                  />
                )}
              </ul>
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;
