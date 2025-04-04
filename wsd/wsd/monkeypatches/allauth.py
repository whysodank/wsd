def monkeypatch_allauth_username_email_login():
    # https://codeberg.org/allauth/django-allauth/pulls/4326
    import allauth.headless.account.inputs
    from allauth.account import app_settings as account_settings
    from allauth.account.adapter import get_adapter as get_account_adapter
    from allauth.account.internal import flows
    from allauth.account.models import Login
    from allauth.core import context

    def clean(self):
        cleaned_data = super(allauth.headless.account.inputs.LoginInput, self).clean()
        if self.errors:
            return cleaned_data
        credentials = {}
        for login_method in account_settings.LOGIN_METHODS:
            value = cleaned_data.get(login_method)
            if value is not None and login_method in self.data.keys():
                credentials[login_method] = value
        if len(credentials) != 1:
            raise get_account_adapter().validation_error("invalid_login")
        password = cleaned_data.get("password")
        if password:
            auth_method = next(iter(credentials.keys()))
            credentials["password"] = password
            user = get_account_adapter().authenticate(context.request, **credentials)
            if user:
                self.login = Login(user=user, email=credentials.get("email"))
                if flows.login.is_login_rate_limited(context.request, self.login):
                    raise get_account_adapter().validation_error("too_many_login_attempts")
            else:
                error_code = "%s_password_mismatch" % auth_method.value
                self.add_error("password", get_account_adapter().validation_error(error_code))
        return cleaned_data

    allauth.headless.account.inputs.LoginInput.clean = clean
