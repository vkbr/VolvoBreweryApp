import SortDescIcon from '@mui/icons-material/ArrowDownward';
import SortAscIcon from '@mui/icons-material/ArrowUpward';
import BreweryIcon from '@mui/icons-material/SportsBar';
import {
  Alert,
  Avatar,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Pagination,
  Toolbar,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spacer from '../../components/TopBar/Spacer';
import { usePagination } from '../../hooks/usePagination';
import { Beer, SORT, TYPE } from '../../types';
import BeerListFilter from './Filters';
import BeerListLoadingIndicator from './LoadingIndicator';
import { fetchData, fetchMatadata } from './utils';

const StyledTooltip = styled(Tooltip)(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: `10px !important`,
  },
}));

const PaginationContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row-reverse',
}));

const BeerList = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<TYPE | undefined>();
  const [sortOrder, setSortOrder] = useState<SORT>('asc');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchMatadata({ by_type: selectedType }).then((meta) => {
      setTotalCount(meta.total);
    });
  }, [selectedType]);

  const {
    currentPage,
    entriesPerPage,
    isLoading,
    requestPageChange,
    resetData,
    slice: brewries,
  } = usePagination<Beer>({
    totalCount,
    initialEntriesPerPage: 10,
    fetchData: async (page, perPage) => {
      return await fetchData({
        page: page + 1,
        per_page: perPage,
        sort: sortOrder,
        by_type: selectedType,
      });
    },
  });

  const toggleSortOrder = useCallback(() => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    resetData();
    setSortOrder(newSortOrder);
  }, [resetData, sortOrder]);

  const handleTypeFilterChange = useCallback(
    (type: TYPE | undefined) => {
      resetData();
      setSelectedType(type);
    },
    [resetData],
  );

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  return (
    <article>
      <section>
        <Toolbar component="header">
          <Typography variant="h3" component="h1">
            Brewery List
          </Typography>
          <Spacer />
          <BeerListFilter
            type={selectedType}
            onChange={handleTypeFilterChange}
          />
          <StyledTooltip
            title={
              <Alert severity="error">
                The `sort=asc|desc` filter is not working for some reason. Even
                though the URL contains sort query params, it doesn't affect the
                response.
              </Alert>
            }
          >
            <IconButton onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? <SortAscIcon /> : <SortDescIcon />}
            </IconButton>
          </StyledTooltip>
        </Toolbar>
        <main>
          <List>
            {isLoading && (
              <BeerListLoadingIndicator entryCount={entriesPerPage} />
            )}
            {!isLoading &&
              brewries.map((beer) => (
                <ListItemButton
                  key={beer.id}
                  onClick={onBeerClick.bind(this, beer.id)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <BreweryIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={beer.name}
                    secondary={beer.brewery_type}
                  />
                </ListItemButton>
              ))}
            <PaginationContainer>
              <Pagination
                count={Math.ceil(totalCount / entriesPerPage)}
                page={currentPage + 1}
                onChange={(_, page) => {
                  requestPageChange(page - 1);
                }}
              />
            </PaginationContainer>
          </List>
        </main>
      </section>
    </article>
  );
};

export default BeerList;
