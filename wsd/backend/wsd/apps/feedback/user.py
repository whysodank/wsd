class UserVoteMixin:
    def _vote_exists(self, instance):
        return instance.vote_class.objects.filter(user=self, post=instance).exists()

    def _create_vote(self, instance, vote_type):
        return instance.vote_class.objects.create(user=self, post=instance, body=vote_type)

    def _update_vote(self, instance, vote_type):
        return instance.vote_class.objects.get(user=self, post=instance).update(body=vote_type)

    def upvote(self, instance):
        vote = instance.vote_class.VoteType.UPVOTE
        self._update_vote(instance, vote) if self._vote_exists(instance) else self._create_vote(instance, vote)

    def downvote(self, instance):
        vote = instance.vote_class.VoteType.DOWNVOTE
        self._update_vote(instance, vote) if self._vote_exists(instance) else self._create_vote(instance, vote)
