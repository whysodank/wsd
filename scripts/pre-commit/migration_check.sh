#!/usr/bin/env bash

exec python wsd/manage.py makemigrations --check --dry-run
