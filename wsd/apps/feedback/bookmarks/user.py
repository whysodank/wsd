from .bookmarks import BOOKMARK_CLASS_ATTRIBUTE


class UserBookmarkMixin:
    @staticmethod
    def _get_bookmark_class(instance):
        return getattr(instance, BOOKMARK_CLASS_ATTRIBUTE)

    def _bookmark_exists(self, instance):
        return self._get_bookmark_class(instance).objects.filter(user=self, post=instance).exists()

    def _get_bookmark(self, instance):
        return self._get_bookmark_class(instance).objects.get(user=self, post=instance)

    def _create_bookmark(self, instance):
        return self._get_bookmark_class(instance).objects.create(user=self, post=instance)

    def bookmark(self, instance):
        if not self._bookmark_exists(instance):
            self._create_bookmark(instance)

    def unbookmark(self, instance):
        if self._bookmark_exists(instance):
            self._get_bookmark(instance).delete()

    def toggle_bookmark(self, instance):
        if self._bookmark_exists(instance):
            self.unbookmark(instance)
        else:
            self.bookmark(instance)

    def is_bookmarked(self, instance):
        return self._bookmark_exists(instance)
