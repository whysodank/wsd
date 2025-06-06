from apps.common.utils import first_of
from apps.core.utils.db import HammingSimilarity
from django.db import models
from django.db.models import Value


class PostQuerySet(models.QuerySet):
    RAW_HAMMING_SIMILARITY = 0.8

    def get_initial(self, instance):
        test_methods = [
            self._cryptographic_hash_is_same,
            self._hamming_similarity_is_too_high,
            self._same_text_and_hamming_similarity_is_too_high,
        ]
        return first_of(test_method(instance) for test_method in test_methods)

    def is_repost(self, instance):
        return self.get_initial(instance) is not None

    def with_hamming_similarities(self, instance):
        qs = self.annotate(
            phash_hamming_similarity=HammingSimilarity("phash", Value(instance.phash)),
            dhash_hamming_similarity=HammingSimilarity("dhash", Value(instance.dhash)),
            whash_hamming_similarity=HammingSimilarity("whash", Value(instance.whash)),
            average_hash_hamming_similarity=HammingSimilarity("average_hash", Value(instance.average_hash)),
            colorhash_hamming_similarity=HammingSimilarity("colorhash", Value(instance.colorhash)),
        )
        return qs

    def _hamming_similarity_is_too_high(self, instance, threshold=RAW_HAMMING_SIMILARITY):
        similar_posts = (
            self.with_hamming_similarities(instance)
            .filter(
                phash_hamming_similarity__gte=threshold,
                dhash_hamming_similarity__gte=threshold,
                whash_hamming_similarity__gte=threshold,
                average_hash_hamming_similarity__gte=threshold,
                colorhash_hamming_similarity__gte=threshold,
            )
            .order_by(*self.model.HASH_FIELDS)
        )
        return self.__get_initial(similar_posts, instance)

    def _cryptographic_hash_is_same(self, instance):
        identical_posts = self.filter(cryptographic_hash=instance.cryptographic_hash)
        return self.__get_initial(identical_posts, instance)

    def _same_text_and_hamming_similarity_is_too_high(self, instance):
        qs = self.filter(extracted_text_normalized=instance.extracted_text_normalized)
        return qs._hamming_similarity_is_too_high(instance)

    @staticmethod
    def __get_initial(similar_queryset, instance):
        first = similar_queryset.exclude(id=instance.id).first()
        return (first.initial if first.initial is not None else first) if first is not None else None

    def without_reposts(self):
        return self.filter(is_repost=False)

    def without_removed(self):
        """
        Filter out removed posts.
        """
        return self.filter(is_removed=False)

    def for_user(self, user=None):
        """
        Filter posts based on user permissions:
        - Superusers can see all posts
        - Regular users can only see non-removed posts
        """
        if user and user.is_authenticated and user.is_superuser:
            return self
        return self.without_removed()
