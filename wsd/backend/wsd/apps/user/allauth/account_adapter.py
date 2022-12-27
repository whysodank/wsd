from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class AccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        return settings.CLIENT_EMAIL_VERIFICATION_PAGE_URL.format(emailconfirmation.key)
