from .notification import NotificationViewSet
from .post import PostViewSet
from .post_category import PostCategoryViewSet
from .post_comment import PostCommentViewSet
from .post_tag import PostTagViewSet
from .user import UserViewSet

__all__ = [
    "UserViewSet",
    "PostViewSet",
    "PostTagViewSet",
    "PostCommentViewSet",
    "PostCategoryViewSet",
    "NotificationViewSet",
]
