# Morphix [Demo](https://morphix.unknownbug.tech)

A platform that enables video editing according to user prompt

## Tools

- Clerk - Auth
- Fal.Ai - Ai transformation
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
