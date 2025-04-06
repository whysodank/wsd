from apps.common.models.base import BaseModel
from apps.common.utils import track_events
from apps.core.querysets import PostQuerySet
from apps.feedback import bookmarks, comments, votes
from apps.tags import tags
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_lifecycle import AFTER_CREATE, hook
from ume import average_hash, colorhash, cryptographic_hash, dhash, get_text_from_image, normalize_text, phash, whash


@track_events()
class Post(BaseModel):
    REPR = "<Post: {self.title}>"
    STR = "{self.title}"
    objects = PostQuerySet.as_manager()
    # DO NOT CHANGE HASH_SIZE, HASH_TEXT_SIZE, BINBITS_SIZE, or BINBITS_HEX_SIZE
    HASH_SIZE = 8
    HASH_HEX_SIZE = 16
    BINBITS_SIZE = 4
    BINBITS_HEX_SIZE = 14
    HASH_FIELDS = ["phash", "dhash", "whash", "average_hash", "colorhash"]
    EXTRACTED_TEXT_FIELDS = ["extracted_text_raw", "extracted_text_normalized"]
    POST_DIRECTORY = "posts"
    EXTRACTED_TEXT_MAX_LENGTH = 10000

    # Post related fields
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="posts",
        verbose_name=_("User"),
        help_text=_("User who posted this post."),
    )
    title = models.CharField(
        max_length=100,
        verbose_name=_("Title"),
        help_text=_("Title of the post."),
    )
    category = models.ForeignKey(
        "core.PostCategory",
        on_delete=models.SET_NULL,
        related_name="posts",
        null=True,
        blank=True,
        help_text=_("Category of the post."),
    )
    image = models.ImageField(
        upload_to=POST_DIRECTORY,
        verbose_name=_("Image"),
        help_text=_("The post itself."),
    )
    is_nsfw = models.BooleanField(default=False, verbose_name=_("Is NSFW?"))
    tags = tags(related_name="posts")

    # Feedback from the user
    comments = comments()
    votes = votes()
    bookmarked_users = bookmarks(related_name="bookmarked_posts")

    # Reposts
    initial = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        related_name="reposts",
        verbose_name=_("Initial"),
        help_text=_("The very first instance of this post in our system, if null, it means this is the initial"),
        blank=True,
        null=True,
    )

    is_repost = models.BooleanField(
        default=False,
        verbose_name=_("Is Repost"),
        help_text=_("Whether this post is a repost or not."),
    )

    # Authorship
    original_source = models.URLField(
        verbose_name=_("Original Source"),
        help_text=_("Verified original source of this post."),
        null=True,
        blank=True,
    )
    is_original = models.BooleanField(
        default=False,
        verbose_name=_("Is Original"),
        help_text=_("Whether this post is made by the user uploading it or not."),
    )

    # Image hash values for the image
    cryptographic_hash = models.CharField(
        max_length=64,
        verbose_name=_("Cryptographic Hash (SHA-256)"),
        help_text=_("SHA-256 value of the image."),
        null=True,
        blank=True,
    )
    phash = models.CharField(
        max_length=HASH_HEX_SIZE,
        verbose_name=_("PHash"),
        help_text=_("PHash value of the image."),
        null=True,
        blank=True,
    )
    dhash = models.CharField(
        max_length=HASH_HEX_SIZE,
        verbose_name=_("DHash"),
        help_text=_("DHash value of the image."),
        null=True,
        blank=True,
    )
    whash = models.CharField(
        max_length=HASH_HEX_SIZE,
        verbose_name=_("WHash"),
        help_text=_("WHash value of the image."),
        null=True,
        blank=True,
    )
    average_hash = models.CharField(
        max_length=HASH_HEX_SIZE,
        verbose_name=_("Average Hash"),
        help_text=_("Average Hash value of the image."),
        null=True,
        blank=True,
    )
    colorhash = models.CharField(
        max_length=BINBITS_HEX_SIZE,
        verbose_name=_("Color Hash"),
        help_text=_("Color Hash value of the image."),
        null=True,
        blank=True,
    )
    extracted_text_raw = models.TextField(
        verbose_name=_("Raw Extracted Text"),
        help_text=_("The raw extracted text from the post, with newlines and everything"),
        null=True,
        blank=True,
        max_length=EXTRACTED_TEXT_MAX_LENGTH,
    )
    extracted_text_normalized = models.TextField(
        verbose_name=_("Normalized Extracted Text"),
        help_text=_("The extracted text from the post, after clearing new lines, extra space and everything else."),
        null=True,
        blank=True,
        max_length=EXTRACTED_TEXT_MAX_LENGTH,
    )

    @hook(AFTER_CREATE, priority=0)
    def calculate_hashes(self):
        self.phash = str(phash(self.image.url, input_type=phash.URL, hash_size=self.HASH_SIZE))
        self.dhash = str(dhash(self.image.url, input_type=dhash.URL, hash_size=self.HASH_SIZE))
        self.whash = str(whash(self.image.url, input_type=whash.URL, hash_size=self.HASH_SIZE))
        self.average_hash = str(average_hash(self.image.url, input_type=average_hash.URL, hash_size=self.HASH_SIZE))
        self.colorhash = str(colorhash(self.image.url, input_type=colorhash.URL, binbits=self.BINBITS_SIZE))
        self.cryptographic_hash = str(cryptographic_hash(self.image.url, input_type=cryptographic_hash.URL))
        self.extracted_text_raw = get_text_from_image(self.image.url, get_text_from_image.URL)
        self.extracted_text_normalized = normalize_text(get_text_from_image(self.image.url, get_text_from_image.URL))
        self.save(skip_hooks=True)

    @hook(AFTER_CREATE, priority=1)
    def check_if_repost(self):
        post_model = self.__class__
        initial = post_model.objects.get_initial(self)
        is_repost = post_model.objects.is_repost(self)
        is_original = False if is_repost else self.is_original
        self.update(initial=initial, is_repost=is_repost, is_original=is_original)

    class Meta:
        verbose_name = _("Post")
        verbose_name_plural = _("Posts")
