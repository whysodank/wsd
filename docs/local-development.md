# Docker setup

## Prerequisites

- This repository cloned
- Docker installed
- Docker Compose installed

## Environment Setup

The project assumes it is running on a domain instead of localhost, which has some drawbacks.
To avoid said drawbacks, we use the hosts file to create our local domain to develop on.

I picked `local-whysodank.com` as the domain but you can pick anything and change the environment variables in .env
file.

- Add the following entries to your hosts file: (for linux this file is commonly located at commonly in `/etc/hosts`)

```hosts
  127.0.0.1 local-whysodank.com
  127.0.0.1 api.local-whysodank.com
  127.0.0.1 admin.local-whysodank.com
  127.0.0.1 auth.local-whysodank.com
  127.0.0.1 media.local-whysodank.com
```

- Copy `example.env` to a new file `.env` in project root and update the domain values if you are not using
  `local-whysodank.com`
- Only if you want to run the frontend appart from the docker: Copy `example.env.frontend` to a new file `.env` in
  the `wsd-frontend` folder and update the domain values if you are not using `local-whysodank.com`

## Run the project

- `docker compose up --build` This will build the images and start the containers (`--build` is optional if you have
  already built the images and didn't change anything)
- `docker compose up -d` This will start the containers in detached mode
- `docker compose build frontend/backend/server/database` This will build the images for the frontend, backend, server
  and database if you dont want to rebuild everything

## Run everything except the frontend

- `docker compose --env-file .env -f docker-compose-dev/docker-compose.backend.yml up --build` This will build the
  images and start the containers
- (in the `wsd-frontend` folder) `npm run dev` This will start the frontend in development mode (this is only needed if
  you want to run the frontend outside of docker)

## Run everything except backend

- `docker compose --env-file .env -f docker-compose-dev/docker-compose.frontend.yml up --build` This will build the
  images and start the containers

```shell
python manage.py migrate
python manage.py setup
python manage.py collectstatic --noinput
exec uwsgi --ini /wsd/uwsgi.ini
```

## Caveats

- Doesn't have volumes mounted for the actual workdir so you have to rebuild the image every time you change something (
  you can add the volumes manually and do `git update-index --assume-unchanged <file> docker-compose.yml`)
- It probably doesn't work in Apple Silicon and maybe not even on Windows.
