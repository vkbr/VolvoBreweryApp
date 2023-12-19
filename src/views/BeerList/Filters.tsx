import ClearIcon from '@mui/icons-material/DeleteOutline';
import FilterIcon from '@mui/icons-material/FilterAlt';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Chip,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { TYPE } from '../../types';
import { breweryTypes } from './constants';

interface Props {
  type?: TYPE;
  onChange: (type: TYPE | undefined) => void;
}

const BeerListFilter = ({ type: currentType, onChange }: Props) => {
  const [lastSelectedType, setLastSelectedType] =
    useState<typeof currentType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  useEffect(() => {
    if (currentType) {
      setLastSelectedType(currentType);
    }
  }, [currentType]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleOnFilterClick = (type: TYPE | undefined) => {
    onChange(type);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'beer-list-filter' : undefined;

  return (
    <>
      <Collapse orientation="horizontal" in={Boolean(currentType)}>
        <Chip
          label={`Type: ${lastSelectedType}`}
          onDelete={() => {
            handleOnFilterClick(undefined);
          }}
        />
      </Collapse>
      <IconButton
        aria-describedby={id}
        aria-controls={open ? 'beerlist-filter-menu' : undefined}
        onClick={handleClick}
      >
        <FilterIcon />
      </IconButton>
      <Menu
        id={id}
        aria-labelledby="beerlist-filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem disabled>TAGS</MenuItem>
        {breweryTypes.map((type) => (
          <MenuItem key={type} onClick={handleOnFilterClick.bind(this, type)}>
            <ListItemIcon>
              {type === currentType ? (
                <RadioButtonCheckedIcon />
              ) : (
                <RadioButtonUncheckedIcon />
              )}
            </ListItemIcon>
            <Typography>{type}</Typography>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          color="danger"
          onClick={handleOnFilterClick.bind(this, undefined)}
        >
          <ListItemIcon color="red">
            <ClearIcon />
          </ListItemIcon>
          <Typography>Clear</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BeerListFilter;
