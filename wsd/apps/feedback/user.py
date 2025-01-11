from .votes import VOTE_CLASS_ATTRIBUTE


class UserVoteMixin:
    @staticmethod
    def _get_vote_class(instance):
        return getattr(instance, VOTE_CLASS_ATTRIBUTE)

    def _vote_exists(self, instance):
        return self._get_vote_class(instance).objects.filter(user=self, post=instance).exists()

    def _get_vote(self, instance):
        return self._get_vote_class(instance).objects.get(user=self, post=instance)

    def _create_vote(self, instance, vote_type):
        return self._get_vote_class(instance).objects.create(user=self, post=instance, body=vote_type)

    def _update_vote(self, instance, vote_type):
        return self._get_vote_class(instance).objects.get(user=self, post=instance).update(body=vote_type)

    def upvote(self, instance):
        vote = self._get_vote_class(instance).VoteType.UPVOTE
        self._update_vote(instance, vote) if self._vote_exists(instance) else self._create_vote(instance, vote)

    def downvote(self, instance):
        vote = self._get_vote_class(instance).VoteType.DOWNVOTE
        self._update_vote(instance, vote) if self._vote_exists(instance) else self._create_vote(instance, vote)

    def unvote(self, instance):
        if self._vote_exists(instance):
            self._get_vote(instance).delete()
