"""
This module holds all the raw sql queries and utilities to run them easily.
"""

from django.db import connection
from psycopg import sql as _sql

literal = _sql.Literal
identifier = _sql.Identifier
sql = _sql.SQL
partial_identifier = sql


# TODO: replace sql.SQL this with PartialIdentifier
# https://stackoverflow.com/questions/70389367/psycopg2-partial-identifier/70389691#70389691


def execute(query):
    with connection.cursor() as cursor:
        cursor.execute(query)


def executable(query, name=None):
    def wrapper():
        return execute(query)

    if name:
        wrapper.__name__ = name
    return wrapper
