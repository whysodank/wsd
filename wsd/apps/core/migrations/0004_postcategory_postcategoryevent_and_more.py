# Generated by Django 5.1.3 on 2025-03-15 04:49

import re
import uuid

import django.core.validators
import django.db.models.deletion
import django_lifecycle.mixins
import pgtrigger.compiler
import pgtrigger.migrations
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_add_pg_similarity"),
        ("pghistory", "0006_delete_aggregateevent"),
    ]

    operations = [
        migrations.CreateModel(
            name="PostCategory",
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
                    models.CharField(
                        help_text="Name of the category.",
                        max_length=100,
                        verbose_name="Name",
                    ),
                ),
                (
                    "handle",
                    models.SlugField(
                        help_text="Slug/Handle of the category.",
                        max_length=100,
                        unique=True,
                        validators=[
                            django.core.validators.RegexValidator(
                                re.compile("^[-a-zA-Z0-9_]+\\Z"),
                                "Enter a valid “slug” consisting of letters, numbers, underscores or hyphens.",
                                "invalid",
                            )
                        ],
                        verbose_name="Slug/Handle",
                    ),
                ),
                (
                    "icon",
                    models.TextField(
                        help_text="Icon for the category, in svg format.",
                        verbose_name="Icon",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post Category",
                "verbose_name_plural": "Post Categories",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="PostCategoryEvent",
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
                    models.CharField(
                        help_text="Name of the category.",
                        max_length=100,
                        verbose_name="Name",
                    ),
                ),
                (
                    "handle",
                    models.SlugField(
                        db_index=False,
                        help_text="Slug/Handle of the category.",
                        max_length=100,
                        validators=[
                            django.core.validators.RegexValidator(
                                re.compile("^[-a-zA-Z0-9_]+\\Z"),
                                "Enter a valid “slug” consisting of letters, numbers, underscores or hyphens.",
                                "invalid",
                            )
                        ],
                        verbose_name="Slug/Handle",
                    ),
                ),
                (
                    "icon",
                    models.TextField(
                        help_text="Icon for the category, in svg format.",
                        verbose_name="Icon",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        pgtrigger.migrations.RemoveTrigger(
            model_name="post",
            name="insert_insert",
        ),
        pgtrigger.migrations.RemoveTrigger(
            model_name="post",
            name="update_update",
        ),
        pgtrigger.migrations.RemoveTrigger(
            model_name="post",
            name="delete_delete",
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="post",
            trigger=pgtrigger.compiler.Trigger(
                name="insert_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postevent" ("average_hash", "category_id", "colorhash", "created_at", "cryptographic_hash", "dhash", "extracted_text_normalized", "extracted_text_raw", "id", "image", "initial_id", "is_repost", "original_source", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "phash", "slug", "title", "updated_at", "user_id", "whash") VALUES (NEW."average_hash", NEW."category_id", NEW."colorhash", NEW."created_at", NEW."cryptographic_hash", NEW."dhash", NEW."extracted_text_normalized", NEW."extracted_text_raw", NEW."id", NEW."image", NEW."initial_id", NEW."is_repost", NEW."original_source", _pgh_attach_context(), NOW(), \'insert\', NEW."id", NEW."phash", NEW."slug", NEW."title", NEW."updated_at", NEW."user_id", NEW."whash"); RETURN NULL;',
                    hash="56915f3d642ff7baa261a51664fc02cae1596902",
                    operation="INSERT",
                    pgid="pgtrigger_insert_insert_1a363",
                    table="core_post",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="post",
            trigger=pgtrigger.compiler.Trigger(
                name="update_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postevent" ("average_hash", "category_id", "colorhash", "created_at", "cryptographic_hash", "dhash", "extracted_text_normalized", "extracted_text_raw", "id", "image", "initial_id", "is_repost", "original_source", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "phash", "slug", "title", "updated_at", "user_id", "whash") VALUES (NEW."average_hash", NEW."category_id", NEW."colorhash", NEW."created_at", NEW."cryptographic_hash", NEW."dhash", NEW."extracted_text_normalized", NEW."extracted_text_raw", NEW."id", NEW."image", NEW."initial_id", NEW."is_repost", NEW."original_source", _pgh_attach_context(), NOW(), \'update\', NEW."id", NEW."phash", NEW."slug", NEW."title", NEW."updated_at", NEW."user_id", NEW."whash"); RETURN NULL;',
                    hash="77cd6609e34cac74216166a69171c55321be7918",
                    operation="UPDATE",
                    pgid="pgtrigger_update_update_7429e",
                    table="core_post",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="post",
            trigger=pgtrigger.compiler.Trigger(
                name="delete_delete",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postevent" ("average_hash", "category_id", "colorhash", "created_at", "cryptographic_hash", "dhash", "extracted_text_normalized", "extracted_text_raw", "id", "image", "initial_id", "is_repost", "original_source", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "phash", "slug", "title", "updated_at", "user_id", "whash") VALUES (OLD."average_hash", OLD."category_id", OLD."colorhash", OLD."created_at", OLD."cryptographic_hash", OLD."dhash", OLD."extracted_text_normalized", OLD."extracted_text_raw", OLD."id", OLD."image", OLD."initial_id", OLD."is_repost", OLD."original_source", _pgh_attach_context(), NOW(), \'delete\', OLD."id", OLD."phash", OLD."slug", OLD."title", OLD."updated_at", OLD."user_id", OLD."whash"); RETURN NULL;',
                    hash="f00f679bd4407cd01e1ef8ef754e847a4a51ff62",
                    operation="DELETE",
                    pgid="pgtrigger_delete_delete_edf98",
                    table="core_post",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postcategory",
            trigger=pgtrigger.compiler.Trigger(
                name="insert_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postcategoryevent" ("created_at", "handle", "icon", "id", "name", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "slug", "updated_at") VALUES (NEW."created_at", NEW."handle", NEW."icon", NEW."id", NEW."name", _pgh_attach_context(), NOW(), \'insert\', NEW."id", NEW."slug", NEW."updated_at"); RETURN NULL;',
                    hash="0ea002bd107d73afa68713848e00800307c537a2",
                    operation="INSERT",
                    pgid="pgtrigger_insert_insert_55a18",
                    table="core_postcategory",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postcategory",
            trigger=pgtrigger.compiler.Trigger(
                name="update_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postcategoryevent" ("created_at", "handle", "icon", "id", "name", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "slug", "updated_at") VALUES (NEW."created_at", NEW."handle", NEW."icon", NEW."id", NEW."name", _pgh_attach_context(), NOW(), \'update\', NEW."id", NEW."slug", NEW."updated_at"); RETURN NULL;',
                    hash="447048ea840afcf7b4971360865a86039fd0bc57",
                    operation="UPDATE",
                    pgid="pgtrigger_update_update_5df3f",
                    table="core_postcategory",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postcategory",
            trigger=pgtrigger.compiler.Trigger(
                name="delete_delete",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postcategoryevent" ("created_at", "handle", "icon", "id", "name", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "slug", "updated_at") VALUES (OLD."created_at", OLD."handle", OLD."icon", OLD."id", OLD."name", _pgh_attach_context(), NOW(), \'delete\', OLD."id", OLD."slug", OLD."updated_at"); RETURN NULL;',
                    hash="c338b54d32a4c2bcd037f4f7ebb95f230afd4c4f",
                    operation="DELETE",
                    pgid="pgtrigger_delete_delete_119c1",
                    table="core_postcategory",
                    when="AFTER",
                ),
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="category",
            field=models.ForeignKey(
                blank=True,
                help_text="Category of the post.",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="posts",
                to="core.postcategory",
            ),
        ),
        migrations.AddField(
            model_name="postevent",
            name="category",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                help_text="Category of the post.",
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                related_query_name="+",
                to="core.postcategory",
            ),
        ),
        migrations.AddField(
            model_name="postcategoryevent",
            name="pgh_context",
            field=models.ForeignKey(
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="pghistory.context",
            ),
        ),
        migrations.AddField(
            model_name="postcategoryevent",
            name="pgh_obj",
            field=models.ForeignKey(
                db_constraint=False,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="events",
                to="core.postcategory",
            ),
        ),
    ]
