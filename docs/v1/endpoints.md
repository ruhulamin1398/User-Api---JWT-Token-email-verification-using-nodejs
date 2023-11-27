## USERS




### Clear User Data 

```http
///Request 

GET /clean-data HTTP/1.1
Host: https://v1-doctor-app-api-f99762d9291a.herokuapp.com

```


```http
///Response 
    status:200

{
    "msg": "All users was deleted ",
    "users": []
}

```



### User Registration

```http
///Request 

POST /api/v1/users/register HTTP/1.1
Host: https://v1-doctor-app-api-f99762d9291a.herokuapp.com
Content-Type: application/json
Content-Length: 107

{
    "username": "monkey",
    "email": "a6b16965640bb3@crankymonkey.info",
    "password": "123234"
}
```


```http
///Response 
    status:201

{
    "msg": "Account Created Successful. Please verify your Email",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoibW9ua2V5IiwiZW1haWwiOiJhNmIxNjk2NTY0MGJiM0BjcmFua3ltb25rZXkuaW5mbyIsImlkIjoiNjU2NDBjYThmM2VhNjBkYjkwMzEzMzQ4IiwiZGF0YSI6e319LCJpYXQiOjE3MDEwNTU2NTYsImV4cCI6MTczMjE1OTY1Nn0.7BIOfOw1wN9rD2Lqr3bopik-Zr2zILHDTgfvOWzc4y0"
}
```





### User Login

```http
///Request 

POST /api/v1/users/login HTTP/1.1
Host: https://v1-doctor-app-api-f99762d9291a.herokuapp.com
Content-Type: application/json
Content-Length: 78

{ 
    "email": "a6b16965640bb3@crankymonkey.info",
    "password": "123234"
}
```


```http
///Response 
    status:200

{
    "msg": "login Successfull",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoibW9ua2V5IiwiZW1haWwiOiJhNmIxNjk2NTY0MGJiM0BjcmFua3ltb25rZXkuaW5mbyIsImlkIjoiNjU2NDBjYThmM2VhNjBkYjkwMzEzMzQ4IiwiZGF0YSI6e319LCJpYXQiOjE3MDEwNTc3NTksImV4cCI6MTczMjE2MTc1OX0.bNOUgKQg5Tgl1NX-vlG4d7SRA1syHEHQ-9N0PE3SIfo"
}
```





### Current User 

```http
///Request 

GET /api/v1/users/current/ HTTP/1.1
Host: v1-doctor-app-api-f99762d9291a.herokuapp.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoibW9ua2V5IiwiZW1haWwiOiJhNmIxNjk2NTY0MGJiM0BjcmFua3ltb25rZXkuaW5mbyIsImlkIjoiNjU2NDBjYThmM2VhNjBkYjkwMzEzMzQ4IiwiZGF0YSI6e319LCJpYXQiOjE3MDEwNTc3NTksImV4cCI6MTczMjE2MTc1OX0.bNOUgKQg5Tgl1NX-vlG4d7SRA1syHEHQ-9N0PE3SIfo
```


```http
///Response 
    status:200

{

    "username": "monkey",
    "email": "a6b16965640bb3@crankymonkey.info",
    "id": "65640ca8f3ea60db90313348",
    "data": {}

}
```






### Resend Verification Email 

```http
///Request 

GET /api/v1/users/resend-verification-email HTTP/1.1
Host: https://v1-doctor-app-api-f99762d9291a.herokuapp.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoibW9ua2V5IiwiZW1haWwiOiJhNmIxNjk2NTY0MGJiM0BjcmFua3ltb25rZXkuaW5mbyIsImlkIjoiNjU2NDBjYThmM2VhNjBkYjkwMzEzMzQ4IiwiZGF0YSI6e319LCJpYXQiOjE3MDEwNTU2NTYsImV4cCI6MTczMjE1OTY1Nn0.7BIOfOw1wN9rD2Lqr3bopik-Zr2zILHDTgfvOWzc4y0

```


```http
///Response 
    status:200


{
    "msg": "Verification email send successful"
}

```





### Verify OTP 

```http
///Request 

GET /api/v1/users/verify-otp-token?token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoic2Fnb3IyMyIsImVtYWlsIjoidGV0YXBhNzA0N0BreGdpZi5jb20iLCJpZCI6IjY1NjAyZDBjNWEyZTM4MmQ2OWVhZmZmYiIsImRhdGEiOnt9fSwiaWF0IjoxNzAwODA3MDQ3LCJleHAiOjE3MzE5MTEwNDd9.3ttU9Dqq9i7QGqs05wkARRlHdlEEvLHTU-o2r5eIah8 HTTP/1.1
Host: https://v1-doctor-app-api-f99762d9291a.herokuapp.com

```


```http
///Response 
    status:200


{
    "msg": "Verification email send successful"
}

```




