from .original_source_claim import OriginalSourceClaimAdmin
from .post import PostAdmin
from .post_category import PostCategoryAdmin
from .post_comment import PostCommentAdmin
from .post_tag import PostTagAdmin

__all__ = [
    "PostAdmin",
    "OriginalSourceClaimAdmin",
    "PostCommentAdmin",
    "PostTagAdmin",
    "PostCategoryAdmin",
]
