import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wsd.settings")

app = Celery("wsd")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
app.conf.task_time_limit = 240
app.conf.task_soft_time_limit = 120
app.conf.beat_schedule = {}
