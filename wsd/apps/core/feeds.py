from urllib.parse import quote

from apps.core.models import Post
from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Atom1Feed

from wsd.config import CONFIG as config

post_template_url = f"{config.PROTOCOL}://{config.HOSTS.DOMAIN}/posts/%s"
user_template_url = f"{config.PROTOCOL}://{config.HOSTS.DOMAIN}/users/%s"
category_template_url = f"{config.PROTOCOL}://{config.HOSTS.DOMAIN}/?category__handle=%s"


class LatestPostsFeed(Feed):
    title = "Latest Memes"
    link = f"{config.PROTOCOL}://{config.HOSTS.DOMAIN}"
    description = f"Latest memes from the site. Check out it at {config.PROTOCOL}://{config.HOSTS.DOMAIN}!"
    language = "en"

    def items(self):
        return Post.objects.filter(is_nsfw=False).order_by("-created_at")[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        description = f'Meme by <a href="{self._item_author_link(item)}">{item.user.username}</a> ( {f'<a href="{self._item_category_link(item)}">{item.category.name}</a>' if item.category else f'<a href="{config.PROTOCOL}://{config.HOSTS.DOMAIN}">Recent</a>'} )'
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

    def _item_author_link(self, item):
        return user_template_url % item.user.username

    def _item_category_link(self, item):
        # Escape the category name to be URL-safe
        return (category_template_url % quote(item.category.handle, safe="")) if item.category else None

    def item_pubdate(self, item):
        return item.created_at

    def item_extra_kwargs(self, item):
        """
        Return extra keywords arguments for each item in the feed.
        """
        return {
            "image_url": item.image.url if item.image else None,
            "category": item.category.name if item.category else None,
            "color": item.colorhash if item.colorhash else None,
        }


class AtomLatestPostsFeed(LatestPostsFeed):
    feed_type = Atom1Feed
    subtitle = LatestPostsFeed.description
