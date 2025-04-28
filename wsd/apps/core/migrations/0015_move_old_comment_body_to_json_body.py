from django.db import migrations


def text_to_tip_tap_json(text):
    paragraphs = [{"type": "paragraph", "content": [{"type": "text", "text": l}]} for l in text.splitlines() or [text]]
    return {"type": "doc", "content": paragraphs}


def move_old_comment_body_to_json_body(apps, schema_editor):
    post_comment_model = apps.get_model("core", "PostComment")
    # This is elidable so we can just do a for loop since at this point in time the db don't have that many records
    for post_comment in post_comment_model.objects.all():
        post_comment.body = text_to_tip_tap_json(post_comment.body_text)
        post_comment.save(update_fields=["body"])


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0014_remove_postcomment_insert_insert_and_more"),
    ]

    operations = [
        migrations.RunPython(
            move_old_comment_body_to_json_body,
            reverse_code=migrations.RunPython.noop,
            elidable=True,
        ),
    ]
