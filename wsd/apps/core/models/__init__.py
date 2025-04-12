from .original_source_claim import OriginalSourceClaim
from .post import Post
from .post_category import PostCategory
from .user_post_view import UserPostView

# Notification import should come after the rest because it _can_ use the other models for notification registry
from .notification import Notification  # isort: skip

PostComment = Post.comment_class
PostCommentVote = PostComment.vote_class
PostVote = Post.vote_class
PostTag = Post.tag_class
PostBookmark = Post.bookmark_class

__all__ = [
    "Post",
    "PostComment",
    "PostCommentVote",
    "PostVote",
    "OriginalSourceClaim",
    "UserPostView",
    "PostTag",
    "PostCategory",
    "PostBookmark",
    "Notification",
]
