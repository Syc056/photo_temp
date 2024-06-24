
# PhotoMong

Setup guide for PhotoMong

## Software Requirement

https://docs.google.com/document/d/1FQ5ymvjH7Cqen4Xe6SP6PP8iYMq-D1Bs0hz6Q3kEq1c/edit?usp=sharing

## Database Schema

https://dbdiagram.io/d/Photomong-65f16a3db1f3d4062cce1cb5

## Installation

### Backend


```bash
  cd backend
  pip install -r requirements.txt
  python manage.py runserver
```

### Frontend (App)

```bash
  cd app
  rm -rf node_modules
  npm cache clean --force
  npm install
  npm start
```


## Usage/Examples

```bash
   run.bat
```

### Backend

```javascript
const axios = require('axios');
let data = JSON.stringify({
  "email": "test@gmail.com",
  "password": "123"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:8080/api/v1/accounts/login',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

```



