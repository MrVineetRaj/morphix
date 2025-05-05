# Morphix [Demo](https://morphix.unknownbug.tech)

A platform that enables video editing according to user prompt

## Features

- Transform your videos with single click
- Download videos transformed by others
- Download and use them
- Robust search mechanism
- Pagination
- Uploadcare File validation
- Neat and clean UI/UX

## Tools

- Clerk - Auth
- Fal.Ai - Ai transformation
- Uploadcare - for validating files
- MongoDB - Database
- Next JS - Framework
- Typescript - Main Programming Language
- Tailwind CSS - For Styling

---

You can connect me on linked in my username is `mrvineetraj`

# Commands to Run in docker ( Recommended )

after opening this project in your code editor

Prepare all the `env variables` according to example

then run following commands

```bash
docker build -t morphix-dev .
```

```bash
docker run -p 3000:3000 \
  -v .:/app \
  -v /app/node_modules \

  morphix-dev
```
