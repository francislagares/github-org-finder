import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const CircularLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        margin: 4,
      }}
    >
      <CircularProgress sx={{ color: 'black' }} />
    </Box>
  );
};

export default CircularLoader;
