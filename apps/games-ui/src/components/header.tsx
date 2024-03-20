// Copyright 2024 Josilyn McGuinness
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  AppBar,
  Typography,
  Button,
  Box,
  Paper,
  Container,
} from '@mui/material';

const Header = () => {
  const nav = useNavigate();

  return (
    <AppBar
      className="header"
      position="static"
      style={{ marginBottom: '25px' }}
    >
      <Toolbar>
        <img
          src="../public/headerGameImage.png"
          alt="dice and pawns"
          width="100px"
          style={{ margin: '10px' }}
        />
        <Container sx={{ width: '425px', marginLeft: '10px' }}>
          <Paper
            elevation={3}
            sx={{
              padding: '15px',
              background: '#fc9803',
              borderRadius: '20px',
            }}
          >
            <Typography
              color="#2e3030"
              variant="h3"
              sx={{ fontWeight: 'bold' }}
            >
              Classic Games
            </Typography>
          </Paper>
        </Container>
        <Box>
          <Button
            color="secondary"
            sx={{ fontWeight: '700', marginTop: '40px' }}
            onClick={() => nav('/games')}
          >
            GAME LIST
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
