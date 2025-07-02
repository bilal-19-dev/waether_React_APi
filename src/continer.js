import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CloudIcon from '@mui/icons-material/Cloud';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import SunnyIcon from '@mui/icons-material/Sunny';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CloudySnowingIcon from '@mui/icons-material/CloudySnowing';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { MapContainer, TileLayer, useMapEvent} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Dialog , DialogActions , DialogContent } from '@mui/material';

export default function GeneralContainer() {
  const [weatherData, setWeatherData] = useState({});
  const [suner, setsuner] = useState({suner : ""});
  const [location , setLocation] = useState(null);
  const [len , setleng] = useState("en");
  const [DialogOpen, setDialogOpen] = useState(false);
  const [map, setMap] = useState({open : false , lat : 0 , lon : 0 , location : null});
  
  const background = useMemo(() => {
    if (suner.suner === "sunrise") {
      return 'linear-gradient(to bottom ,rgb(48, 102, 209) 80%,white )';
    } else if (suner.suner === "sunset") {
      return 'linear-gradient(to bottom ,rgb(255, 102, 0) 80%,white )';
    }
    else if (suner.suner === "moon") {
      return 'url("/Screenshot.png")';
    }
    return 'linear-gradient(to bottom ,rgb(48, 102, 209) 80%,white )'; // default background
  }, [suner.suner]);
      
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const paylod = {
            key : 'a123af52f7e33505521be598a5bdcb1d',
            lon : location ? location.lon : longitude,
            lat : location ? location.lat : latitude,
          };
          const response_1 = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=' + paylod.lat + '&lon=' + paylod.lon+ '&appid=a123af52f7e33505521be598a5bdcb1d&lang=' + len + '&units=metric');
          setWeatherData(response_1.data);
          const response_2 = await axios.get('https://api.opencagedata.com/geocode/v1/json?q='+ paylod.lat +'%2C+'+ paylod.lon +'&key=f1fa728207824d28b06a29723e2b59dc&language=' + len);
          setWeatherData((prevData) => ({
            ...prevData,
            local: response_2.data.results[0].components ,
          }));
        }, (error) => {
          console.error('Error getting geolocation:', error);
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherData();
  }, [len, location]);
  document.body.style.direction = len === 'ar' ? 'rtl' : 'ltr';
  useEffect(() => {
    const now = new Date();
    const now_sunrise = new Date(weatherData.sys ? weatherData.sys.sunrise  * 1000: 0 );
    const now_sunset = new Date(weatherData.sys ? weatherData.sys.sunset  * 1000 : 0);
    if (now === now_sunset) {
      setsuner({suner : "sunrise"});
      setTimeout(() => {
        setsuner({suner : "sun"});
      }, 600000);
    } else if (now === now_sunrise) {
      setsuner({suner : "sunset"});
      setTimeout(() => {
        setsuner({suner : "moon"});
      }, 600000);
    }else if (now > now_sunrise && now < now_sunset) {
      setsuner({suner : "sunrise"});
    }else if (now > now_sunset) {
      setsuner({suner : "moon"});
    }
  },[weatherData]);
  const fulldate = new Date(weatherData.dt ? weatherData.dt * 1000 : 0);
  console.log(fulldate.toLocaleDateString(len === "ar" ? 'ar-DZ' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }));

  // استخدم إحداثيات الموقع الفعلي للمستخدم في الخريطة
  const mapPosition = useMemo(() => {
    if (weatherData.coord) {
      return [weatherData.coord.lat, weatherData.coord.lon];
    }
    return [51.505, -0.09];
  }, [weatherData]);
  const UseMapEvent = () => {
    useMapEvent('click', async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const paylod = {
          lon: lng,
          lat: lat,
        };
        const response_1 = await axios.get('https://api.opencagedata.com/geocode/v1/json?q='+ paylod.lat +'%2C+'+ paylod.lon +'&key=f1fa728207824d28b06a29723e2b59dc&language=' + len) ;
        const location = await response_1.data.results[0].components ? response_1.data.results[0].components._normalized_city !== undefined
            ? response_1.data.results[0].components._normalized_city
            : response_1.data.results[0].components.state !== undefined
              ? response_1.data.results[0].components.state
              : response_1.data.results[0].components.body_of_water !== undefined
                ? response_1.data.results[0].components.body_of_water
                : response_1.data.results[0].components.continent !== undefined
                  ? response_1.data.results[0].components.continent
                  : null
          : null;
        setMap({ open: true, lat: lat , lon: lng , location: location });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    });
    return null;
  };
  return (
    <>
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', height: '100vh' , flexDirection: 'column', justifyContent: 'center'}}>
        <CardContent  sx={{ background , color: 'white', width: '100%' , borderRadius: '8px' , padding: '2px' , height: '55%' }}>
            <Box display={'flex'} alignItems={'center'} flexDirection={{ xs: 'column', sm: 'row' }} padding={'0px 5px'} justifyContent={'space-between'} margin={'0px'}>
              <Typography variant="h4" gutterBottom>
                {weatherData.local
                  ? (
                      weatherData.local._normalized_city !== undefined
                        ? weatherData.local._normalized_city
                        : weatherData.local.state !== undefined
                          ? weatherData.local.state
                          : weatherData.local.body_of_water !== undefined
                            ? weatherData.local.body_of_water
                            : weatherData.local.continent !== undefined
                              ? weatherData.local.continent
                              : <CircularProgress color="inherit" />
                    )
                  : <CircularProgress color="inherit" />
                }
              </Typography>
              <Typography variant="h4" gutterBottom>
                {fulldate.toLocaleDateString(len === "ar" ? 'ar-DZ' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
            <Divider sx={{margin : '0px' , backgroundColor: 'white'}} />
            <Grid container spacing={2} justifyContent="center">
              <Grid item size={{ xs: 7}}>
                <Grid item  sx={{ display: 'flex', alignItems: 'end' , height: '150px' , padding: '0px 30px' }}>
                  {weatherData.weather?
                    <>
                      <Typography variant="h1" gutterBottom>
                         {Math.round(weatherData.main.feels_like) }
                      </Typography>
                      <Typography variant="h1" gutterBottom>c°</Typography>
                    </>
                    :
                     <CircularProgress color="inherit" />}
                </Grid>
                <Grid item  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' , padding: '0px 30px' , height: '10px'  }}>
                  {weatherData.weather?
                    <Typography variant="h5" gutterBottom>
                      {weatherData.weather[0].description }
                    </Typography>
                    :
                     <CircularProgress color="inherit" />}
                </Grid>
                <Grid  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' , padding: '0px 30px' , height: '100px'  }}>
                  {weatherData.weather ? (
                      len === "ar" ? (
                        <Typography variant="subtitle1">
                          الصغرى {Math.round(weatherData.main.temp_min)}° / الكبرى {Math.round(weatherData.main.temp_max)}°
                        </Typography>
                      ) : len === "en" ? (
                        <Typography variant="subtitle1">
                          lowest {Math.round(weatherData.main.temp_min)}° / highest {Math.round(weatherData.main.temp_max)}°
                        </Typography>
                      ) : null
                    ) : (
                      <CircularProgress color="inherit" size={20} />
                    )
                  }
                </Grid>
              </Grid>
              <Grid item height={200} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}size={{ xs: 5}}>
                <Box sx={{ width: '200px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {
                    weatherData.weather ? (
                      weatherData.weather[0].main === 'Clear' ? (
                        suner.suner === "sunrise" ? <WbTwilightIcon sx={{ fontSize: 100, color: 'gold' }} /> :
                        suner.suner === "sun" ? <SunnyIcon sx={{ fontSize: 100, color: 'orangered' }} /> :
                        suner.suner === "sunset" ? <WbTwilightIcon sx={{ fontSize: 100, color: 'orangered' }} /> :
                        suner.suner === "moon" ? <DarkModeIcon sx={{ fontSize: 100, color: 'Blue' }} /> :
                        <Brightness1Icon sx={{ fontSize: 100, color: 'gold' }} />
                      ) :
                      weatherData.weather[0].main === 'Clouds' ? <CloudIcon sx={{ fontSize: 100, color: 'white' }} /> :
                      weatherData.weather[0].main === 'Rain' ? <CloudySnowingIcon sx={{ fontSize: 100, color: 'white' }} /> :
                      weatherData.weather[0].main === 'Snow' ? <CloudySnowingIcon sx={{ fontSize: 100, color: 'white' }} /> :
                      weatherData.weather[0].main === 'Drizzle' ? <WaterDropIcon sx={{ fontSize: 100, color: 'skyblue' }} /> :
                      weatherData.weather[0].main === 'Thunderstorm' ? <ThunderstormIcon sx={{ fontSize: 100, color: 'gray' }} /> :
                      <CircularProgress color="inherit" />
                    ) : (
                      <CircularProgress color="inherit" />
                    )
                  }
                </Box>
              </Grid>
            </Grid>
        </CardContent>
        <Box  sx={{ display: 'flex', justifyContent: 'end', width: '100%', paddingTop: '10px'}}>
          <Button onClick={() => setDialogOpen({open: true, id: 1})} variant="contained" color="primary" size="large" sx={{ margin: '0px 10px' }} >
            <AddLocationIcon />
          </Button>
          <Button sx={{ display: len === "ar" ? "block" : "none" }} onClick={() => setleng("en")}  variant="contained" color="primary" size="large">
            EN
          </Button>
          <Button sx={{ display: len === "en" ? "block" : "none" }} onClick={() => setleng("ar")} variant="contained" color="primary" size="large">
            AR
          </Button>
        </Box>
        
      </Container>
      <Dialog open={DialogOpen} onClose={() => setDialogOpen(false)} sx={{ width: '100%' }} PaperProps={{ style: { width: '100%' } }}>
        <DialogContent >
          <Typography variant="h6" gutterBottom>
            {len === "ar" ? "اضغط على الخريطة لتحديد موقعك" : "Click on the map to set your location"}
          </Typography>
          <div style={{ width: '100%' , height: '50vh'}}>
            <MapContainer center={mapPosition} zoom={1} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                noWrap = {true}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

              />
              <UseMapEvent />
            </MapContainer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            {len === "ar" ? "إلغاء" : "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={map.open} onClose={() => setMap({...map , open : false})}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {len === "ar" ? " الموقع المختار " : "Selected Location"} : 
          </Typography>
          <Typography variant="h6" gutterBottom>
            { map.location !== null ? map.location : <CircularProgress color="inherit" />}
          </Typography>
          <DialogActions>
            <Button onClick={() => setMap({...map , open :false})} color="primary">
              {len === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={() => {
              setDialogOpen(false);
              setLocation({ lat: map.lat, lon: map.lon });
              setMap({...map , open : false});
            }} color="primary">
              {len === "ar" ? "تأكيد" : "Confirm"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
