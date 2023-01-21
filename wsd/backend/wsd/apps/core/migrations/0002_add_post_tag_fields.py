import uuid

import django.contrib.postgres.fields.citext
import django.core.validators
import django.db.models.deletion
import django_lifecycle.mixins
import pgtrigger.compiler
import pgtrigger.migrations
from django.contrib.postgres.operations import CITextExtension
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pghistory", "0005_events_middlewareevents"),
        ("core", "0001_initial"),
    ]

    operations = [
        CITextExtension(),
        migrations.CreateModel(
            name="PostObjectTag",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        db_index=True,
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("slug", models.SlugField(blank=True, null=True, verbose_name="Slug")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, db_index=True, verbose_name="Created At"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, db_index=True, verbose_name="Updated At"),
                ),
                (
                    "post",
                    models.ForeignKey(
                        help_text="The post this tag is for.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="post_tags",
                        to="core.post",
                        verbose_name="Post",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post Object Tag",
                "verbose_name_plural": "Post Object Tags",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="PostTag",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        db_index=True,
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("slug", models.SlugField(blank=True, null=True, verbose_name="Slug")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, db_index=True, verbose_name="Created At"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, db_index=True, verbose_name="Updated At"),
                ),
                (
                    "name",
                    django.contrib.postgres.fields.citext.CICharField(
                        help_text="The tag's name, the tag itself.",
                        max_length=100,
                        validators=[
                            django.core.validators.RegexValidator(
                                "^[a-zA-Z0-9_.-]*$",
                                "Tags can only contain letters, numbers, - and _.",
                            )
                        ],
                        verbose_name="Name",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post Tag",
                "verbose_name_plural": "Post Tags",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="PostTagEvent",
            fields=[
                ("pgh_id", models.AutoField(primary_key=True, serialize=False)),
                ("pgh_created_at", models.DateTimeField(auto_now_add=True)),
                ("pgh_label", models.TextField(help_text="The event label.")),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "slug",
                    models.SlugField(blank=True, db_index=False, null=True, verbose_name="Slug"),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="Created At"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="Updated At"),
                ),
                (
                    "name",
                    django.contrib.postgres.fields.citext.CICharField(
                        help_text="The tag's name, the tag itself.",
                        max_length=100,
                        validators=[
                            django.core.validators.RegexValidator(
                                "^[a-zA-Z0-9_.-]*$",
                                "Tags can only contain letters, numbers, - and _.",
                            )
                        ],
                        verbose_name="Name",
                    ),
                ),
                (
                    "pgh_context",
                    models.ForeignKey(
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="pghistory.context",
                    ),
                ),
                (
                    "pgh_obj",
                    models.ForeignKey(
                        db_constraint=False,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="event",
                        to="core.posttag",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="PostObjectTagEvent",
            fields=[
                ("pgh_id", models.AutoField(primary_key=True, serialize=False)),
                ("pgh_created_at", models.DateTimeField(auto_now_add=True)),
                ("pgh_label", models.TextField(help_text="The event label.")),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "slug",
                    models.SlugField(blank=True, db_index=False, null=True, verbose_name="Slug"),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="Created At"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="Updated At"),
                ),
                (
                    "pgh_context",
                    models.ForeignKey(
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="pghistory.context",
                    ),
                ),
                (
                    "pgh_obj",
                    models.ForeignKey(
                        db_constraint=False,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="event",
                        to="core.postobjecttag",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The post this tag is for.",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to="core.post",
                        verbose_name="Post",
                    ),
                ),
                (
                    "tag",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The Tag.",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to="core.posttag",
                        verbose_name="Tag",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="postobjecttag",
            name="tag",
            field=models.ForeignKey(
                help_text="The Tag.",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="post_tags",
                to="core.posttag",
                verbose_name="Tag",
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="posttag",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_posttagevent" ("created_at", "id", "name", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "slug", "updated_at") VALUES (NEW."created_at", NEW."id", NEW."name", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."slug", NEW."updated_at"); RETURN NULL;',
                    hash="d829b475cfd253071eafaf9a84b60b8492593681",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_81ee8",
                    table="core_posttag",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="posttag",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_posttagevent" ("created_at", "id", "name", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "slug", "updated_at") VALUES (NEW."created_at", NEW."id", NEW."name", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."slug", NEW."updated_at"); RETURN NULL;',
                    hash="c4e06231840e8fc2c64c8358bc33c535226143f9",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_bfd60",
                    table="core_posttag",
                    when="AFTER",
                ),
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="tags",
            field=models.ManyToManyField(through="core.PostObjectTag", to="core.posttag"),
        ),
        migrations.AddConstraint(
            model_name="postobjecttag",
            constraint=models.UniqueConstraint(fields=("tag", "post"), name="unique_post_object_tag"),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postobjecttag",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postobjecttagevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "tag_id", "updated_at") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."tag_id", NEW."updated_at"); RETURN NULL;',
                    hash="2a52b028298d06b90e9cbc23c3eaa214341acf48",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_63367",
                    table="core_postobjecttag",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postobjecttag",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postobjecttagevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "tag_id", "updated_at") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."tag_id", NEW."updated_at"); RETURN NULL;',
                    hash="84bfede823394d94ad53ba63ae61075538f8bad0",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_d94fb",
                    table="core_postobjecttag",
                    when="AFTER",
                ),
            ),
        ),
    ]
