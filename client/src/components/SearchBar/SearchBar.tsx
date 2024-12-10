import React, { useState } from 'react';

import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';

interface SearchBarProps {
  onSearch: (orgName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <Paper
      component='form'
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: 1,
        display: 'flex',
        maxWidth: 600,
        width: '100%',
        mx: 'auto',
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <TextField
        fullWidth
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder='Search for repositories by organization name'
        variant='standard'
        slotProps={{
          input: {
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  type='submit'
                  sx={{ p: '10px' }}
                  aria-label='search'
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Paper>
  );
};

export default SearchBar;
