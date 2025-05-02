# Docker setup

## Prerequisites

- This repository cloned
- Docker installed
- Docker Compose installed

## Environment Setup

The project assumes it is running on a domain instead of localhost, which has some drawbacks.
To avoid said drawbacks, we use the hosts file to create our local domain to develop on.

I picked `local-whysodank.com` as the domain but you can pick anything and change the environment variables in .env file.

- Add the following entries to your hosts file: (for linux this file is commonly located at commonly in `/etc/hosts`)

```hosts
  127.0.0.1 local-whysodank.com
  127.0.0.1 api.local-whysodank.com
  127.0.0.1 admin.local-whysodank.com
  127.0.0.1 auth.local-whysodank.com
  127.0.0.1 media.local-whysodank.com
```

- Copy `example.env` to a new file `.env` in project root and update the domain values if you are not using `local-whysodank.com`

## Run the project

`docker compose up` should build the images and start the containers.

## Caveats

It probably doesn't work in Apple Silicon and maybe not even on Windows.
