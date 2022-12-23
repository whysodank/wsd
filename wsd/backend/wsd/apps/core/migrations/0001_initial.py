import uuid

import django.db.models.deletion
import django_lifecycle.mixins
import pgtrigger.compiler
import pgtrigger.migrations
from django.conf import settings
from django.db import migrations, models

from apps.core.sql import execute, CREATE_HAMMING_DISTANCE_FUNCTION, CREATE_HEX_TO_INT_FUNCTION
from apps.core.utils import PGSimilarityExtension


def create_hamming_distance_utilities(apps, schema_editor):
    execute(CREATE_HEX_TO_INT_FUNCTION)
    execute(CREATE_HAMMING_DISTANCE_FUNCTION)


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("pghistory", "0005_events_middlewareevents"),
    ]

    operations = [
        migrations.RunPython(create_hamming_distance_utilities, reverse_code=migrations.RunPython.noop),
        PGSimilarityExtension(),
        migrations.CreateModel(
            name="OriginalSourceClaim",
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
                    models.DateTimeField(
                        auto_now_add=True, db_index=True, verbose_name="Created At"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, verbose_name="Updated At"
                    ),
                ),
                (
                    "comment",
                    models.TextField(
                        help_text="Comments about the source.",
                        max_length=1000,
                        verbose_name="Comment",
                    ),
                ),
                (
                    "source",
                    models.URLField(
                        help_text="The source of the original post.",
                        verbose_name="Source",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="pending",
                        help_text="The status of the claim.",
                        max_length=100,
                        verbose_name="Status",
                    ),
                ),
                (
                    "contact_information",
                    models.TextField(
                        blank=True,
                        help_text="Contact Information for the user, so that we can get in touch about this claim",
                        max_length=1000,
                        null=True,
                        verbose_name="Contact information",
                    ),
                ),
            ],
            options={
                "verbose_name": "Original Source Claim",
                "verbose_name_plural": "Original Source Claims",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="Post",
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
                    models.DateTimeField(
                        auto_now_add=True, db_index=True, verbose_name="Created At"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, verbose_name="Updated At"
                    ),
                ),
                (
                    "title",
                    models.CharField(
                        help_text="Title of the post.",
                        max_length=100,
                        verbose_name="Title",
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        help_text="The post itself.",
                        upload_to="posts",
                        verbose_name="Image",
                    ),
                ),
                (
                    "is_repost",
                    models.BooleanField(
                        default=False,
                        help_text="Whether this post is a repost or not.",
                        verbose_name="Is Repost",
                    ),
                ),
                (
                    "original_source",
                    models.URLField(
                        blank=True,
                        help_text="Verified original source of this post.",
                        null=True,
                        verbose_name="Original Source",
                    ),
                ),
                (
                    "cryptographic_hash",
                    models.CharField(
                        blank=True,
                        help_text="SHA-256 value of the image.",
                        max_length=64,
                        null=True,
                        verbose_name="Cryptographic Hash (SHA-256)",
                    ),
                ),
                (
                    "phash",
                    models.CharField(
                        blank=True,
                        help_text="PHash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="PHash",
                    ),
                ),
                (
                    "dhash",
                    models.CharField(
                        blank=True,
                        help_text="DHash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="DHash",
                    ),
                ),
                (
                    "whash",
                    models.CharField(
                        blank=True,
                        help_text="WHash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="WHash",
                    ),
                ),
                (
                    "average_hash",
                    models.CharField(
                        blank=True,
                        help_text="Average Hash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="Average Hash",
                    ),
                ),
                (
                    "colorhash",
                    models.CharField(
                        blank=True,
                        help_text="Color Hash value of the image.",
                        max_length=14,
                        null=True,
                        verbose_name="Color Hash",
                    ),
                ),
                (
                    "extracted_text_raw",
                    models.TextField(
                        blank=True,
                        help_text="The raw extracted text from the post, with newlines and everything",
                        max_length=10000,
                        null=True,
                        verbose_name="Raw Extracted Text",
                    ),
                ),
                (
                    "extracted_text_normalized",
                    models.TextField(
                        blank=True,
                        help_text="The extracted text from the post, after clearing new lines, extra space and everything else.",
                        max_length=10000,
                        null=True,
                        verbose_name="Normalized Extracted Text",
                    ),
                ),
                (
                    "initial",
                    models.ForeignKey(
                        blank=True,
                        help_text="The very first instance of this post in our system, if null, it means this is the initial",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reposts",
                        to="core.post",
                        verbose_name="Initial",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="User who posted this post.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="posts",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post",
                "verbose_name_plural": "Posts",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="PostComment",
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
                    models.DateTimeField(
                        auto_now_add=True, db_index=True, verbose_name="Created At"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, verbose_name="Updated At"
                    ),
                ),
                (
                    "body",
                    models.TextField(
                        help_text="The actual comment.", verbose_name="Body"
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        help_text="The post this comment is for.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="comments",
                        to="core.post",
                        verbose_name="Post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="User who wrote this comment..",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="post_comments",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post Comment",
                "verbose_name_plural": "Post Comments",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="PostCommentVote",
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
                    models.DateTimeField(
                        auto_now_add=True, db_index=True, verbose_name="Created At"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, verbose_name="Updated At"
                    ),
                ),
                (
                    "body",
                    models.IntegerField(
                        choices=[(1, "Upvote"), (-1, "Downvote")],
                        help_text="The actual vote. -1 or +1",
                        verbose_name="Body",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        help_text="The post this vote is for.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="votes",
                        to="core.postcomment",
                        verbose_name="Post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="The voter.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="post_comment_votes",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "PostComment Vote",
                "verbose_name_plural": "Post Comment Votes",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="PostVote",
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
                    models.DateTimeField(
                        auto_now_add=True, db_index=True, verbose_name="Created At"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, verbose_name="Updated At"
                    ),
                ),
                (
                    "body",
                    models.IntegerField(
                        choices=[(1, "Upvote"), (-1, "Downvote")],
                        help_text="The actual vote. -1 or +1",
                        verbose_name="Body",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        help_text="The post this vote is for.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="votes",
                        to="core.post",
                        verbose_name="Post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="The voter.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="post_votes",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "Post Vote",
                "verbose_name_plural": "Post Votes",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="UserPostView",
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
                    models.DateTimeField(
                        auto_now_add=True, db_index=True, verbose_name="Created At"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, verbose_name="Updated At"
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        help_text="The post that is viewed.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="post_views",
                        to="core.post",
                        verbose_name="Post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="The user who viewed the post.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="post_views",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="User",
                    ),
                ),
            ],
            options={
                "verbose_name": "User Post View",
                "verbose_name_plural": "User Post Views",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="UserPostViewEvent",
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
                    models.SlugField(
                        blank=True, db_index=False, null=True, verbose_name="Slug"
                    ),
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
                        to="core.userpostview",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The post that is viewed.",
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
                        help_text="The user who viewed the post.",
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
        migrations.CreateModel(
            name="PostVoteEvent",
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
                    models.SlugField(
                        blank=True, db_index=False, null=True, verbose_name="Slug"
                    ),
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
                    "body",
                    models.IntegerField(
                        choices=[(1, "Upvote"), (-1, "Downvote")],
                        help_text="The actual vote. -1 or +1",
                        verbose_name="Body",
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
                        to="core.postvote",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The post this vote is for.",
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
                        help_text="The voter.",
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
        migrations.CreateModel(
            name="PostEvent",
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
                    models.SlugField(
                        blank=True, db_index=False, null=True, verbose_name="Slug"
                    ),
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
                    "title",
                    models.CharField(
                        help_text="Title of the post.",
                        max_length=100,
                        verbose_name="Title",
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        help_text="The post itself.",
                        upload_to="posts",
                        verbose_name="Image",
                    ),
                ),
                (
                    "is_repost",
                    models.BooleanField(
                        default=False,
                        help_text="Whether this post is a repost or not.",
                        verbose_name="Is Repost",
                    ),
                ),
                (
                    "original_source",
                    models.URLField(
                        blank=True,
                        help_text="Verified original source of this post.",
                        null=True,
                        verbose_name="Original Source",
                    ),
                ),
                (
                    "cryptographic_hash",
                    models.CharField(
                        blank=True,
                        help_text="SHA-256 value of the image.",
                        max_length=64,
                        null=True,
                        verbose_name="Cryptographic Hash (SHA-256)",
                    ),
                ),
                (
                    "phash",
                    models.CharField(
                        blank=True,
                        help_text="PHash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="PHash",
                    ),
                ),
                (
                    "dhash",
                    models.CharField(
                        blank=True,
                        help_text="DHash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="DHash",
                    ),
                ),
                (
                    "whash",
                    models.CharField(
                        blank=True,
                        help_text="WHash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="WHash",
                    ),
                ),
                (
                    "average_hash",
                    models.CharField(
                        blank=True,
                        help_text="Average Hash value of the image.",
                        max_length=16,
                        null=True,
                        verbose_name="Average Hash",
                    ),
                ),
                (
                    "colorhash",
                    models.CharField(
                        blank=True,
                        help_text="Color Hash value of the image.",
                        max_length=14,
                        null=True,
                        verbose_name="Color Hash",
                    ),
                ),
                (
                    "extracted_text_raw",
                    models.TextField(
                        blank=True,
                        help_text="The raw extracted text from the post, with newlines and everything",
                        max_length=10000,
                        null=True,
                        verbose_name="Raw Extracted Text",
                    ),
                ),
                (
                    "extracted_text_normalized",
                    models.TextField(
                        blank=True,
                        help_text="The extracted text from the post, after clearing new lines, extra space and everything else.",
                        max_length=10000,
                        null=True,
                        verbose_name="Normalized Extracted Text",
                    ),
                ),
                (
                    "initial",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        help_text="The very first instance of this post in our system, if null, it means this is the initial",
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to="core.post",
                        verbose_name="Initial",
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
                        to="core.post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="User who posted this post.",
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
        migrations.CreateModel(
            name="PostCommentVoteEvent",
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
                    models.SlugField(
                        blank=True, db_index=False, null=True, verbose_name="Slug"
                    ),
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
                    "body",
                    models.IntegerField(
                        choices=[(1, "Upvote"), (-1, "Downvote")],
                        help_text="The actual vote. -1 or +1",
                        verbose_name="Body",
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
                        to="core.postcommentvote",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The post this vote is for.",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to="core.postcomment",
                        verbose_name="Post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The voter.",
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
        migrations.CreateModel(
            name="PostCommentEvent",
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
                    models.SlugField(
                        blank=True, db_index=False, null=True, verbose_name="Slug"
                    ),
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
                    "body",
                    models.TextField(
                        help_text="The actual comment.", verbose_name="Body"
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
                        to="core.postcomment",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The post this comment is for.",
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
                        help_text="User who wrote this comment..",
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
        migrations.CreateModel(
            name="OriginalSourceClaimEvent",
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
                    models.SlugField(
                        blank=True, db_index=False, null=True, verbose_name="Slug"
                    ),
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
                    "comment",
                    models.TextField(
                        help_text="Comments about the source.",
                        max_length=1000,
                        verbose_name="Comment",
                    ),
                ),
                (
                    "source",
                    models.URLField(
                        help_text="The source of the original post.",
                        verbose_name="Source",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("approved", "Approved"),
                            ("rejected", "Rejected"),
                        ],
                        default="pending",
                        help_text="The status of the claim.",
                        max_length=100,
                        verbose_name="Status",
                    ),
                ),
                (
                    "contact_information",
                    models.TextField(
                        blank=True,
                        help_text="Contact Information for the user, so that we can get in touch about this claim",
                        max_length=1000,
                        null=True,
                        verbose_name="Contact information",
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
                        to="core.originalsourceclaim",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="The post this claim is for.",
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
                        help_text="User who made the claim.",
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
        migrations.AddField(
            model_name="originalsourceclaim",
            name="post",
            field=models.ForeignKey(
                help_text="The post this claim is for.",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="original_source_claims",
                to="core.post",
                verbose_name="Post",
            ),
        ),
        migrations.AddField(
            model_name="originalsourceclaim",
            name="user",
            field=models.ForeignKey(
                help_text="User who made the claim.",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="original_source_claims",
                to=settings.AUTH_USER_MODEL,
                verbose_name="User",
            ),
        ),
        migrations.AddConstraint(
            model_name="postvote",
            constraint=models.UniqueConstraint(
                fields=("user", "post"), name="unique_post_vote"
            ),
        ),
        migrations.AddConstraint(
            model_name="postcommentvote",
            constraint=models.UniqueConstraint(
                fields=("user", "post"), name="unique_post_comment_vote"
            ),
        ),
        migrations.AddConstraint(
            model_name="postcomment",
            constraint=models.CheckConstraint(
                check=models.Q(("body__length__gte", 0)),
                name="post_comment_comment_minimum_length",
            ),
        ),
        migrations.AddConstraint(
            model_name="postcomment",
            constraint=models.CheckConstraint(
                check=models.Q(("body__length__lte", 1000)),
                name="post_comment_comment_maximum_length",
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="userpostview",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_userpostviewevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="aab1309a26deaa9d6df374b1c90f0b6b9f0e94bb",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_3d752",
                    table="core_userpostview",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="userpostview",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_userpostviewevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="a9e4d3fd81a2bf4634df1d60cb0dac280d6feeb7",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_35717",
                    table="core_userpostview",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postvote",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postvoteevent" ("body", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."body", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="d0ac5c725d0abd8639d928bc0399221d6c4c58b2",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_988c3",
                    table="core_postvote",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postvote",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postvoteevent" ("body", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."body", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="c08dd616c031003e60bd4c7b6d7a2492ea7a02ad",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_b9194",
                    table="core_postvote",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postcommentvote",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postcommentvoteevent" ("body", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."body", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="8e2edbe07840bbd93b5d30c4d50cb5713a90d2fb",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_25175",
                    table="core_postcommentvote",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postcommentvote",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postcommentvoteevent" ("body", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."body", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="dc2444e2c5a0cbb40ea06c4f2afa3a050aaeb2de",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_694ae",
                    table="core_postcommentvote",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postcomment",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postcommentevent" ("body", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."body", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="2953178e8a5783794ee2a854e8a886062023699f",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_40f9d",
                    table="core_postcomment",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="postcomment",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postcommentevent" ("body", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "updated_at", "user_id") VALUES (NEW."body", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="84d211c62578c237f2d374937dbfe572f52e61f0",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_f9c43",
                    table="core_postcomment",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="post",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_postevent" ("average_hash", "colorhash", "created_at", "cryptographic_hash", "dhash", "extracted_text_normalized", "extracted_text_raw", "id", "image", "initial_id", "is_repost", "original_source", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "phash", "slug", "title", "updated_at", "user_id", "whash") VALUES (NEW."average_hash", NEW."colorhash", NEW."created_at", NEW."cryptographic_hash", NEW."dhash", NEW."extracted_text_normalized", NEW."extracted_text_raw", NEW."id", NEW."image", NEW."initial_id", NEW."is_repost", NEW."original_source", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."phash", NEW."slug", NEW."title", NEW."updated_at", NEW."user_id", NEW."whash"); RETURN NULL;',
                    hash="557025ec24a254772d230e7703e99dbfff5f3df5",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_afd3d",
                    table="core_post",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="post",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_postevent" ("average_hash", "colorhash", "created_at", "cryptographic_hash", "dhash", "extracted_text_normalized", "extracted_text_raw", "id", "image", "initial_id", "is_repost", "original_source", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "phash", "slug", "title", "updated_at", "user_id", "whash") VALUES (NEW."average_hash", NEW."colorhash", NEW."created_at", NEW."cryptographic_hash", NEW."dhash", NEW."extracted_text_normalized", NEW."extracted_text_raw", NEW."id", NEW."image", NEW."initial_id", NEW."is_repost", NEW."original_source", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."phash", NEW."slug", NEW."title", NEW."updated_at", NEW."user_id", NEW."whash"); RETURN NULL;',
                    hash="a5c02c5162a26acf99720b0ea79f4bf49aa067be",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_a8e0e",
                    table="core_post",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="originalsourceclaim",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_originalsourceclaimevent" ("comment", "contact_information", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "source", "status", "updated_at", "user_id") VALUES (NEW."comment", NEW."contact_information", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."source", NEW."status", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="e6f70ed576d6e67960538f66e2d6131f603b2f86",
                    operation="INSERT",
                    pgid="pgtrigger_snapshot_insert_7ce61",
                    table="core_originalsourceclaim",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="originalsourceclaim",
            trigger=pgtrigger.compiler.Trigger(
                name="snapshot_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_originalsourceclaimevent" ("comment", "contact_information", "created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "post_id", "slug", "source", "status", "updated_at", "user_id") VALUES (NEW."comment", NEW."contact_information", NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'snapshot\', NEW."id", NEW."post_id", NEW."slug", NEW."source", NEW."status", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="a068418555a7cdabf8fc5b53b74e20a521c842ea",
                    operation="UPDATE",
                    pgid="pgtrigger_snapshot_update_e017b",
                    table="core_originalsourceclaim",
                    when="AFTER",
                ),
            ),
        ),
    ]
