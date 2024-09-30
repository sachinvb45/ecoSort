import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Divider } from '@mui/material';
import ReactPlayer from 'react-player';

function WasteDisposal() {
  const [wasteData, setWasteData] = useState({});
  const [selectedWaste, setSelectedWaste] = useState(null);

  useEffect(() => {
    // Fetch waste data from the backend API
    const fetchWasteData = async () => {
      try {
        const response = await fetch('http://localhost:8000/wasteDescRt/wasteData'); // Adjust if the API URL differs
        console.log(response)
        const data = await response.json();
        setWasteData(data);
      } catch (error) {
        console.error('Error fetching waste data:', error);
      }
    };

    fetchWasteData();
  }, []);

  const handleCardClick = (wasteType) => {
    setSelectedWaste(wasteType);
  };

  const renderCard = (wasteType) => {
    const { title, description } = wasteData[wasteType];
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={wasteType}>
        <Paper
          elevation={3}
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            textAlign: 'center', 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '300px' 
          }}
          onClick={() => handleCardClick(wasteType)}
        >
          <ReactPlayer 
            url={wasteData[wasteType].videoUrl} 
            width='100%' 
            height='150px' 
            controls
          />
          <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {description}
          </Typography>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h2" align="center" sx={{ mb: 1 }} fontSize={{ xs: '24px', sm: '32px', md: '38px', lg: '46px' }}>
        Know Your Waste
      </Typography>
      
      {selectedWaste ? (
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            {wasteData[selectedWaste].title}
          </Typography>
          <ReactPlayer 
            url={wasteData[selectedWaste].videoUrl} 
            controls
            width='600px'
            height='350px'
          />
          <Typography variant="body1" sx={{ mb: 2 }}>
            {wasteData[selectedWaste].description}
          </Typography>
          <Button variant="contained" onClick={() => setSelectedWaste(null)}>Back to Grid</Button>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {Object.keys(wasteData).map(renderCard)}
        </Grid>
      )}
    </Box>
  );
}

export default WasteDisposal;
