from django.db.models import CharField, TextField
from django.db.models.functions import Length

CharField.register_lookup(Length, "length")
TextField.register_lookup(Length, "length")
