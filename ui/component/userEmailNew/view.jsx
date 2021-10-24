// @flow
import * as PAGES from 'constants/pages';
import { DOMAIN, SIMPLE_SITE } from 'config';
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import analytics from 'analytics';
import { EMAIL_REGEX } from 'constants/email';
import I18nMessage from 'component/i18nMessage';
import { useHistory } from 'react-router-dom';
import Card from 'component/common/card';
import ErrorText from 'component/common/error-text';
import Nag from 'component/common/nag';
import classnames from 'classnames';
import OdyseeLogoWithWhiteText from 'component/header/odysee_white.png';
import OdyseeLogoWithText from 'component/header/odysee.png';
import LoginGraphic from 'component/loginGraphic';

type Props = {
  errorMessage: ?string,
  emailExists: boolean,
  isPending: boolean,
  syncEnabled: boolean,
  setSync: (boolean) => void,
  balance: number,
  daemonSettings: { share_usage_data: boolean },
  setShareDiagnosticData: (boolean) => void,
  doSignUp: (string, ?string) => Promise<any>,
  clearEmailEntry: () => void,
  interestedInYoutubSync: boolean,
  doToggleInterestedInYoutubeSync: () => void,
  currentTheme: string,
};

function UserEmailNew(props: Props) {
  const {
    errorMessage,
    isPending,
    doSignUp,
    setSync,
    daemonSettings,
    setShareDiagnosticData,
    clearEmailEntry,
    emailExists,
    interestedInYoutubSync,
    doToggleInterestedInYoutubeSync,
    currentTheme,
  } = props;
  const { share_usage_data: shareUsageData } = daemonSettings;
  const { push, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const defaultEmail = emailFromUrl ? decodeURIComponent(emailFromUrl) : '';
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [localShareUsageData, setLocalShareUsageData] = React.useState(false);
  const [formSyncEnabled, setFormSyncEnabled] = useState(true);
  const valid = email.match(EMAIL_REGEX);

  function handleUsageDataChange() {
    setLocalShareUsageData(!localShareUsageData);
  }

  function handleSubmit() {
    // @if TARGET='app'
    setSync(formSyncEnabled);
    setShareDiagnosticData(true);
    // @endif
    doSignUp(email, password === '' ? undefined : password).then(() => {
      analytics.emailProvidedEvent();
    });
  }

  function handleChangeToSignIn(additionalParams) {
    clearEmailEntry();

    let url = `/$/${PAGES.AUTH_SIGNIN}`;
    const urlParams = new URLSearchParams(location.search);

    urlParams.delete('email');
    if (email) {
      urlParams.set('email', encodeURIComponent(email));
    }

    urlParams.delete('email_exists');
    if (emailExists) {
      urlParams.set('email_exists', '1');
    }

    push(`${url}?${urlParams.toString()}`);
  }

  React.useEffect(() => {
    if (emailExists) {
      handleChangeToSignIn();
    }
  }, [emailExists]);

  return (
    <div
      className={classnames('main__sign-up', {
        'main__sign-up--graphic': SIMPLE_SITE,
      })}
    >
      <Card
        // @if TARGET='app'
        subtitle={__('An account allows you to earn rewards and backup your data.')}
        // @endif
        actions={
          <div className={classnames({ 'card--disabled': DOMAIN === 'lbry.tv' })}>
            <Form onSubmit={handleSubmit} className="section">
              <p className="help--card-actions">
                <I18nMessage>If you want to upload content to LBRY Network download Desktop App</I18nMessage>
              </p>
            </Form>
          </div>
        }
        nag={
          <>
            {IS_WEB && DOMAIN === 'lbry.tv' && (
              <Nag
                relative
                message={
                  <I18nMessage
                    tokens={{
                      odysee: (
                        <Button button="link" label={__('odysee.com')} href="https://odysee.com?src=lbrytv-retired" />
                      ),
                    }}
                  >
                    {__(
                      'lbry.tv is being retired in favor of %odysee% and new sign ups are disabled. Sign up on %odysee% instead'
                    )}
                  </I18nMessage>
                }
              />
            )}
            {errorMessage && <Nag type="error" relative message={<ErrorText>{errorMessage}</ErrorText>} />}
          </>
        }
        secondPane={SIMPLE_SITE && <LoginGraphic />}
      />

      {IS_WEB && DOMAIN === 'lbry.tv' && (
        <div className="signup__odysee-logo">
          <Button href="https://odysee.com?src=lbrytv-retired">
            <img src={currentTheme === 'light' ? OdyseeLogoWithText : OdyseeLogoWithWhiteText} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserEmailNew;
