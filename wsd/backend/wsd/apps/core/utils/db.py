from django.contrib.postgres.operations import CreateExtension
from django.db.models.expressions import Func
from django.db.models.fields import FloatField, IntegerField


class HexToInt(Func):
    function = 'hex_to_int'
    output_field = IntegerField()


class HammingSimilarity(Func):
    function = 'hamming_text'
    arity = 2
    output_field = FloatField()


class PGSimilarityExtension(CreateExtension):
    # https://github.com/eulerto/pg_similarity
    def __init__(self):  # NOQA
        self.name = "pg_similarity"
