import pghistory


def track_events(klass=None, **kwargs):
    """
    Usage:

    @track
    class MyModel(models.Model):
        ...

    @track(exclude=["password"])
    class MyUserModel(AbstractUser):
        ...

    """
    if klass is None:
        return pghistory.track(pghistory.Snapshot(), **kwargs)
    return pghistory.track(pghistory.Snapshot(), **kwargs)(klass)
