import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  styled,
} from '@mui/material';

interface Props {
  entryCount: number;
}

const StyledSkeleton = styled(Skeleton)(() => ({
  display: 'block',
  maxWidth: '100%',
  width: '100%',
}));

const BeerListLoadingIndicator = ({ entryCount }: Props) => {
  return (
    <>
      {Array.from({ length: entryCount }).map((_, index) => (
        <ListItem key={`skel-${index}`}>
          <ListItemIcon>
            <Skeleton variant="circular" width={40} height={40} color="#000" />
          </ListItemIcon>
          <ListItemText
            primary={<StyledSkeleton>&nbsp;</StyledSkeleton>}
            secondary={<StyledSkeleton>&nbsp;</StyledSkeleton>}
          ></ListItemText>
        </ListItem>
      ))}
    </>
  );
};

export default BeerListLoadingIndicator;
