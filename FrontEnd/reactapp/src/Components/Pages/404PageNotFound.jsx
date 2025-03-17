import { PATHS } from "../../constants/paths";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from '@mui/material';
import photo404 from '../../Static/Image/photo404.jpg'

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        Sorry, page not found!
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 6, maxWidth: 400 }}
      >
        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your spelling.
      </Typography>

      <Box
        sx={{
          position: 'relative',
          mb: 6,
        }}
      >

        <img
          src={photo404}
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            objectFit: 'cover',
          }}
        >
        </img>
        {/* <Typography
         sx={{
            fontSize: 180,
            fontWeight: 'bold',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            position: 'relative',
          }}
        >
          404
        </Typography> */}
      </Box>

      <Button
        variant="contained"
        onClick={() => navigate(PATHS.HOME)}
        sx={{
          bgcolor: 'text.primary',
          color: 'background.paper',
          px: 4,
          py: 1,
          '&:hover': {
            bgcolor: 'text.primary',
            opacity: 0.9,
          },
        }}
      >
        Go to home
      </Button>
    </Box>
  )
}
export default PageNotFound;