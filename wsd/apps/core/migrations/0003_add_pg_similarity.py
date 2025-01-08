from apps.core.utils.db import PGSimilarityExtension
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_remove_originalsourceclaim_insert_insert_and_more"),
    ]

    operations = [PGSimilarityExtension()]
