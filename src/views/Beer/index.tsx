import BreweryTypeIcon from '@mui/icons-material/Factory';
import FavIconSelected from '@mui/icons-material/Favorite';
import FavIconUnselected from '@mui/icons-material/FavoriteBorder';
import WebsiteIcon from '@mui/icons-material/Language';
import LocationIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Toolbar,
  Typography,
  TypographyProps,
  styled,
} from '@mui/material';
import { computed } from '@preact/signals-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spacer from '../../components/TopBar/Spacer';
import { beerStore } from '../../store';
import { Beer as IBeer } from '../../types';
import { fetchData } from './utils';

const Header = styled(Toolbar)(({ theme }) => ({
  '@media (min-width:0px)': {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const InfoTypography = (props: TypographyProps) => (
  // @ts-ignore
  <Typography {...props} variant="h6" component="p" />
);

const Beer = () => {
  const { id } = useParams() as { id: string };
  const [beer, setBeer] = useState<IBeer>();
  const { favouriteBeers, toggleFavourite } = beerStore;
  const isFavourite = computed(() => favouriteBeers.value.includes(id));

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeer, id), [id]);

  const address = useMemo(
    () =>
      !beer
        ? null
        : [
            beer.address_1,
            beer.address_2,
            beer.address_3,
            `${beer.city} (${beer.postal_code})`,
            beer.state,
            beer.country,
          ]
            .filter((entry) => !!entry)
            .join(', '),
    [beer],
  );

  const boundingBox = useMemo(() => {
    const latDistFromCenter = 0.0120106616;
    const lonDistFromCenter = 0.0170724098;

    if (!beer) return undefined;

    const lat = parseFloat(beer.latitude);
    const lon = parseFloat(beer.longitude);
    return [
      lon - lonDistFromCenter,
      lat - latDistFromCenter,
      lon + lonDistFromCenter,
      lat + latDistFromCenter,
    ].join('%2C');
  }, [beer]);

  return (
    <article>
      <section>
        <Header>
          <Typography variant="h4" component="h1">
            {beer?.name ?? <Skeleton />}
          </Typography>
          <Spacer />
          <IconButton onClick={toggleFavourite.bind(this, id)}>
            {isFavourite.value ? <FavIconSelected /> : <FavIconUnselected />}
          </IconButton>
        </Header>
        <main>
          <List>
            {beer?.website_url && (
              <ListItem>
                <ListItemIcon>
                  <WebsiteIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link href={beer?.website_url ?? '#'} target="_blank">
                      <InfoTypography>
                        {beer?.website_url} <OpenInNewIcon fontSize="inherit" />
                      </InfoTypography>
                    </Link>
                  }
                  secondary="Website URL"
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemIcon>
                <BreweryTypeIcon />
              </ListItemIcon>
              <ListItemText
                primary={<InfoTypography>{beer?.brewery_type}</InfoTypography>}
                secondary="Brewery Type"
              />
            </ListItem>
            {address && (
              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<InfoTypography>{address ?? ''}</InfoTypography>}
                  secondary="Address"
                />
              </ListItem>
            )}
            {beer && boundingBox && (
              <ListItem>
                <ListItemIcon />
                <ListItemText
                  primary={
                    <iframe
                      title={`${beer?.name ?? ''} brewery location`}
                      width="425"
                      height="350"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${boundingBox}&amp;layer=mapnik`}
                      style={{ border: '1px solid black' }}
                    ></iframe>
                  }
                  secondary={
                    <small>
                      <Link
                        href={`https://www.openstreetmap.org/#map=18/${beer?.latitude}/${beer?.longitude}`}
                      >
                        View Larger Map
                      </Link>
                    </small>
                  }
                />
              </ListItem>
            )}
          </List>
        </main>
      </section>
    </article>
  );

  // 8100 Washington Ave, Mount Pleasant 53406-3920, Wisconsinisconsin, United States
};

export default Beer;
