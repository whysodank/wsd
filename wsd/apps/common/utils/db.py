import pghistory
from pghistory.core import DeleteEvent, InsertEvent, UpdateEvent


def track_events(**kwargs):
    def track_model_history(cls):
        """
        Instead of using pghistory.track() directly, if we need base configuration we will do it here.
        """
        trackers = [InsertEvent(), UpdateEvent(), DeleteEvent()]
        return pghistory.track(*trackers, **kwargs)(cls)

    return track_model_history
