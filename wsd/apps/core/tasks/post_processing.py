from celery import shared_task

# We have to avoid circular imports somewhere, instead of having them in the models file
# This is where I prefer to have that ugly part, so importing inside a function only happens in task files.


@shared_task(name="post_image_hashes")
def post_processor(post_id):
    from apps.core.models import Post

    post = Post.objects.get(id=post_id)
    post.calculate_hashes()
    post.check_if_repost()
    post.check_nsfw()
