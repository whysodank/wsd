import re

from rest_framework.exceptions import ValidationError


def regex_validator(regex):
    def validator(value):
        if not re.fullmatch(regex, value):
            raise ValidationError("Value for this field should match {regex}` regex expression.")

    return validator
