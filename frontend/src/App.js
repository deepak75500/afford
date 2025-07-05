import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import URLShortener from './URLShortener';
import URLStats from './URLStats';

function App() {
  const [showStats, setShowStats] = useState(false);

  return (
    <Box sx={{ bgcolor: '#e3f2fd', minHeight: '100vh', py: 4 }}>
      <Container>
        <Box my={2} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? '← Back to Shortener' : ' View Stats'}
          </Button>
        </Box>

        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            HTTP URL Shortener
          </Typography>

          {!showStats ? <URLShortener /> : <URLStats />}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
