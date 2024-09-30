import { Typography, Container, Box, Grid, Paper } from '@mui/material';
import { useTheme } from '@emotion/react';
import { green } from '@mui/material/colors';

function AboutPage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ mb: 4, mt: 2, backgroundColor: isDarkMode ? '#121212' : '#ffffff', py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: isDarkMode ? '#e0e0e0' : '#333',
            textTransform: 'uppercase',
          }}
        >
          About Us
        </Typography>

        <Typography
          variant="h6"
          component="p"
          align="center"
          sx={{
            mb: 4,
            color: '#555',
            maxWidth: 900,
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: "20px", sm: "24px", md: "26px" },
          }}
        >
          Welcome to Eco Sort, your go-to platform for responsible waste disposal! Our mission is to provide you with essential information on the best locations for disposing of various types of waste. Whether it’s wood, plastic, electronic, or medical waste, we connect you with nearby disposal centers to simplify recycling and waste management. Together, we can keep our environment clean and sustainable!
        </Typography>

        <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid item xs={11} md={10}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                textAlign: 'center',
                backgroundColor: green[100],
                color: green[800],
              }}
            >
              <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our goal is to provide accurate and accessible information on waste disposal. By using our platform, you contribute to a cleaner and healthier environment.
              </Typography>
              <Typography variant="body1">
                Join us in improving waste management practices and promoting sustainability in your community.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AboutPage;
