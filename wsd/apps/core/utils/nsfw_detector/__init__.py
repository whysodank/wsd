from functools import cache
from threading import Lock

import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from apps.common.utils.error_handling import suppress_callable_to_sentry
from apps.common.utils.pyutils import enabled_if
from django.conf import settings

MODEL_PATH = settings.BASE_DIR / "apps/core/utils/nsfw_detector/nsfw.299x299.h5"
IMAGE_DIM = 299
TOTAL_THRESHOLD = 0.9
INDIVIDUAL_THRESHOLD = 0.7

predict_lock = Lock()


@cache
def get_nsfw_detection_model(path):
    """
    Load the NSFW detection model from the specified path.
    """
    return tf.keras.models.load_model(path, custom_objects={"KerasLayer": hub.KerasLayer}, compile=False)


@suppress_callable_to_sentry(Exception, return_value=False)
@enabled_if(settings.ENABLE_NSFW_DETECTION, if_not_enabled_return_value=False)
def is_nsfw(image):
    if image.mode == "RGBA":
        image = image.convert("RGB")
    image = image.resize((IMAGE_DIM, IMAGE_DIM))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    with predict_lock:
        preds = get_nsfw_detection_model(MODEL_PATH).predict(image)[0]
    categories = ["drawings", "hentai", "neutral", "porn", "sexy"]
    probabilities = {cat: float(pred) for cat, pred in zip(categories, preds)}
    individual_nsfw_prob = max(probabilities["porn"], probabilities["hentai"], probabilities["sexy"])
    total_nsfw_prob = probabilities["porn"] + probabilities["hentai"] + probabilities["sexy"]
    return (individual_nsfw_prob > INDIVIDUAL_THRESHOLD) or (total_nsfw_prob > TOTAL_THRESHOLD)
