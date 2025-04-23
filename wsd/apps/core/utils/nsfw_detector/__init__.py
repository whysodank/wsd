import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from apps.common.utils.error_handling import suppress_callable_to_sentry
from django.conf import settings

MODEL_PATH = settings.BASE_DIR / "apps/core/utils/nsfw_detector/nsfw.299x299.h5"
model = tf.keras.models.load_model(MODEL_PATH, custom_objects={"KerasLayer": hub.KerasLayer}, compile=False)

IMAGE_DIM = 299
TOTAL_THRESHOLD = 0.9
INDIVIDUAL_THRESHOLD = 0.7


@suppress_callable_to_sentry(Exception, return_value=False)
def is_nsfw(image):
    if image.mode == "RGBA":
        image = image.convert("RGB")
    image = image.resize((IMAGE_DIM, IMAGE_DIM))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    preds = model.predict(image)[0]
    categories = ["drawings", "hentai", "neutral", "porn", "sexy"]
    probabilities = {cat: float(pred) for cat, pred in zip(categories, preds)}
    individual_nsfw_prob = max(probabilities["porn"], probabilities["hentai"], probabilities["sexy"])
    total_nsfw_prob = probabilities["porn"] + probabilities["hentai"] + probabilities["sexy"]
    return (individual_nsfw_prob > INDIVIDUAL_THRESHOLD) or (total_nsfw_prob > TOTAL_THRESHOLD)
