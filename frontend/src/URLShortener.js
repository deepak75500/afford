import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box
} from '@mui/material';
import axios from 'axios';

function URLShortener() {
  const [form, setForm] = useState({ url: '', validity: 30, shortcode: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/shorturls', form);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 1000,
        margin: '40px auto',
        padding: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, color: '#1976d2' }}
      >
        URL Shortener
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Original URL"
            name="url"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Validity (min)"
            name="validity"
            type="number"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Custom Shortcode"
            name="shortcode"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ fontWeight: 'bold', paddingY: 1.2 }}
            onClick={handleSubmit}
          >
            Create Short Link
          </Button>
        </Grid>

        {result && (
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: '#e3f2fd',
                padding: 2,
                borderRadius: 2,
                marginTop: 2,
                textAlign: 'center',
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>Shortened URL:</strong>{' '}
                <a
                  href={result.shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0d47a1', fontWeight: '500' }}
                >
                  {result.shortLink}
                </a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expires at: {new Date(result.expiry).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default URLShortener;
