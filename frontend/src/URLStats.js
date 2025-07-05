import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

function URLStats() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setStats(null);
    setNotFound(false);

    try {
      const res = await axios.get(`http://localhost:5000/shorturls/stats/${code}`);
      setStats(res.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        borderRadius: 3,
        backgroundColor: '#fdfdfd',
        border: '1px solid #e0e0e0'
      }}
    >
      <Typography variant="h5" textAlign="center" mb={3}>
        Short URL Stats
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Shortcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
          sx={{ mr: 2 }}
        />
        <Button onClick={fetchStats} variant="contained" color="primary">
          GET
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={30} />
        </Box>
      )}

      {notFound && (
        <Typography color="error" align="center" mt={2}>
          Shortcode not found or error fetching stats.
        </Typography>
      )}

      {stats && (
        <Box mt={3}>
          <Typography variant="subtitle1">
            <strong>Original URL:</strong> {stats.originalUrl}
          </Typography>
          <Typography variant="body2">
            <strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Expiry:</strong> {new Date(stats.expiry).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Total Clicks:</strong> {stats.totalClicks}
          </Typography>

          <Typography variant="h6" mt={3}>
            Click Details:
          </Typography>

          <Box mt={1}>
            {stats.clicks.map((click, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: '#f1f1f1',
                  my: 1,
                  pl: 2,
                  borderLeft: '4px solid #1976d2'
                }}
              >
                <Typography variant="body2">
                  {new Date(click.timestamp).toLocaleString()} | Referrer: {click.referrer}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default URLStats;
