import { Box, Typography, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import ContactMail from '@mui/icons-material/ContactMail';
import LocationOn from '@mui/icons-material/LocationOn';
import { useTheme } from '@emotion/react';


function ContactPage() {
  const address = "#23, 1st Main, 3rd Cross, Kuvempunagara, Bengaluru - 560019.";
  const googleMapsUrl = `https://www.google.com/maps/search/1st+Main,+3rd+Cross,+Kuvempunagara,+Bengaluru+-+560019./@13.0700857,77.5395393,18.46z?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D`;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        mb: 4,
        mt: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#121212' : '#ffffff' ,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          fontSize: { xs: '24px', sm: '36px', md: '48px' }, // Reduced sizes for better balance
        }}
      >
        Get in Touch with Us!
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, fontSize: { xs: '16px', sm: '20px' }, fontStyle: 'italic' }}>
        We're here to help! Reach out for any inquiries or feedback.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              bgcolor: '#ffffff',
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{ mb: 2, fontSize: { xs: '20px', sm: '24px', md: '28px' }, color: '#1976d2' }}
            >
              Contact Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <ContactMail sx={{ color: '#1976d2' }} />
                      <Typography sx={{ fontSize: { xs: '16px', sm: '18px' }, color: '#555' }}>
                        ecosort3@gmail.com
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <LocationOn sx={{ color: '#1976d2' }} />
                      <Typography sx={{ fontSize: { xs: '16px', sm: '18px' }, color: '#555' }}>
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          {address}
                        </a>
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContactPage;
