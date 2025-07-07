from urllib.parse import quote

from apps.core.models import Post
from django.conf import settings
from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Atom1Feed

# TODO: Use reverse_lazy from django_hosts instead of hardcoding the URL
url = f"{settings.PROTOCOL}://{settings.HOST}"
post_template_url = f"{url}/posts/%s"
user_template_url = f"{url}/users/%s"
category_template_url = f"{url}/?category__handle=%s"


class LatestPostsFeed(Feed):
    title = "Latest Memes"
    link = url
    description = f"Latest memes from the site. Check out it at {url}!"
    language = "en"

    def items(self):
        posts = Post.objects.filter(is_nsfw=False).select_related("user", "category").prefetch_related("tags")
        return posts.order_by("-created_at")[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        # TODO: Probably better if we actually use an html template for this
        category_link = self._category_link(item)
        description = f'Meme by <a href="{self._item_author_link(item)}">{item.user.username}</a> ({category_link})'
        if item.image:
            description += (
                f'<br><br><img src="{item.image.url}" alt="{item.title}" width="{min(item.image.width, 300)}"/>'
            )

        if item.tags.exists():
            tags = ", ".join(tag.name for tag in item.tags.all())
            description += f"<br>Tags: {tags}"

        description += f'<br><br><a href="{self.item_link(item)}">View Post</a>'

        return description

    def item_link(self, item):
        return post_template_url % item.id.hex.replace("-", "")

    @classmethod
    def _category_link(cls, item):
        if item.category:
            return f'<a href="{cls._item_category_link(item)}">{item.category.name}</a>'
        return f'<a href="{url}">Recent</a>'

    @staticmethod
    def _item_author_link(item):
        return user_template_url % item.user.username

    @staticmethod
    def _item_category_link(item):
        return (category_template_url % quote(item.category.handle, safe="")) if item.category else None

    def item_pubdate(self, item):  # NOQA
        return item.created_at

    def item_extra_kwargs(self, item):
        return {
            "image_url": item.image.url if item.image else None,
            "category": item.category.name if item.category else None,
            "color": item.colorhash if item.colorhash else None,
        }


class AtomLatestPostsFeed(LatestPostsFeed):
    feed_type = Atom1Feed
    subtitle = LatestPostsFeed.description
