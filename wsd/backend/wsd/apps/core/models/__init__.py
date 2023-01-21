from .original_source_claim import OriginalSourceClaim
from .post import Post
from .user_post_view import UserPostView

PostComment = Post.comment_class
PostCommentVote = PostComment.vote_class
PostVote = Post.vote_class
PostTag = Post.tag_class

__all__ = [
    "Post",
    "PostComment",
    "PostCommentVote",
    "PostVote",
    "OriginalSourceClaim",
    "UserPostView",
    "PostTag",
]
