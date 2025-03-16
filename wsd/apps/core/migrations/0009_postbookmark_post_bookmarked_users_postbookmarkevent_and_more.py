# Generated by Django 5.1.3 on 2025-03-16 21:53

import uuid

import django.db.models.deletion
import django_lifecycle.mixins
import pgtrigger.compiler
import pgtrigger.migrations
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0008_alter_post_tags"),
        ("pghistory", "0006_delete_aggregateevent"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PostBookmark",
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
                        help_text="The post that is bookmarked.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to="core.post",
                        verbose_name="Post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="The user who bookmarked.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post Bookmark",
                "verbose_name_plural": "Post Bookmarks",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.AddField(
            model_name="post",
            name="bookmarked_users",
            field=models.ManyToManyField(
                help_text="Users who bookmarked this item.",
                related_name="bookmarked_posts",
                through="core.PostBookmark",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Bookmarked Users",
            ),
        ),
        migrations.CreateModel(
            name="PostBookmarkEvent",
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
                        related_name="events",
                        to="core.postbookmark",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The post that is bookmarked.",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to="core.post",
                        verbose_name="Post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The user who bookmarked.",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddConstraint(
            model_name="postbookmark",
            constraint=models.UniqueConstraint(fields=("user", "post"), name="unique_post_bookmark"),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postbookmark",
            trigger=pgtrigger.compiler.Trigger(
                name="insert_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postbookmarkevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'insert\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="08ce691571689c1869ba04bde6734b3c2b897c7e",
                    operation="INSERT",
                    pgid="pgtrigger_insert_insert_b8b2c",
                    table="core_postbookmark",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postbookmark",
            trigger=pgtrigger.compiler.Trigger(
                name="update_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postbookmarkevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'update\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="11b9786bd8725bb126830d4b68df1469065a5bc1",
                    operation="UPDATE",
                    pgid="pgtrigger_update_update_33061",
                    table="core_postbookmark",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postbookmark",
            trigger=pgtrigger.compiler.Trigger(
                name="delete_delete",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postbookmarkevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (OLD."created_at", OLD."id", _pgh_attach_context(), NOW(), \'delete\', OLD."id", OLD."post_id", OLD."slug", OLD."updated_at", OLD."user_id"); RETURN NULL;',
                    hash="db70f64d3a494c35558a371d5bfa6fd1553977bb",
                    operation="DELETE",
                    pgid="pgtrigger_delete_delete_c5665",
                    table="core_postbookmark",
                    when="AFTER",
                ),
            ),
        ),
    ]
