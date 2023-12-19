import { Skeleton, styled } from '@mui/material';

interface Props {
  entryCount: number;
}

const StyledSkeleton = styled(Skeleton)(() => ({
  display: 'block',
  maxWidth: '100%',
  width: 300,
}));

const FavLoadingIndicator = ({ entryCount }: Props) => {
  return (
    <>
      {Array.from({ length: entryCount }).map((_, index) => (
        <li key={`skel-${index}`}>
          <StyledSkeleton>
            <p>&nbsp;</p>
          </StyledSkeleton>
        </li>
      ))}
    </>
  );
};

export default FavLoadingIndicator;
