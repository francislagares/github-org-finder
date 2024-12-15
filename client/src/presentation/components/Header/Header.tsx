import { GitHub } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box textAlign="center">
      <GitHub sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        GitHub Repository Search
      </Typography>
    </Box>
  );
};

export default Header;
