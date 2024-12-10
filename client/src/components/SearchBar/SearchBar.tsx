import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (orgName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        width: 500,
        maxWidth: '100%',
      }}
    >
      <TextField
        type='text'
        value={inputValue}
        onChange={handleChange}
        placeholder='Search for an organization'
        variant='outlined'
        label='Search'
        sx={{ marginRight: 1 }}
        fullWidth
      />
      <IconButton type='submit' aria-label='search'></IconButton>
      <Button type='submit' variant='contained' color='primary'>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
