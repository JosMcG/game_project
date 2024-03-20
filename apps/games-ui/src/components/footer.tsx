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
import { Toolbar, Typography } from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  return (
    <Toolbar
      component={'footer'}
      style={{
        position: 'static',
        backgroundColor: '#fc9803',
        height: '8vh',
      }}
    >
      <Typography variant="overline" color="secondary">
        <CopyrightIcon
          fontSize="small"
          color="secondary"
          sx={{ mb: -0.7, mr: 0.5 }}
        />
        2023 &nbsp;&nbsp;Josilyn McGuinness
      </Typography>
    </Toolbar>
  );
};

export default Footer;
