// @flow
import * as React from 'react';
// @if TARGET='app'
import { shell } from 'electron';
// @endif
import { Lbry } from 'lbry-redux';
import Native from 'native';
import Button from 'component/button';
import Page from 'component/page';
import 'scss/component/_seed';

type DeamonSettings = {
  data_dir: string | any,
};

type Props = {
  deamonSettings: DeamonSettings,
  accessToken: string,
  fetchAccessToken: () => void,
  doAuth: () => void,
  user: any,
};

type VersionInfo = {
  os_system: string,
  os_release: string,
  platform: string,
  lbrynet_version: string,
};

type State = {
  versionInfo: VersionInfo | any,
  lbryId: String | any,
  uiVersion: ?string,
  upgradeAvailable: ?boolean,
  accessTokenHidden: ?boolean,
};

class HelpPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      versionInfo: null,
      lbryId: null,
      uiVersion: null,
      upgradeAvailable: null,
      accessTokenHidden: true,
    };

    (this: any).showAccessToken = this.showAccessToken.bind(this);
    (this: any).openLogFile = this.openLogFile.bind(this);
  }

  componentDidMount() {
    // @if TARGET='app'
    Native.getAppVersionInfo().then(({ localVersion, upgradeAvailable }) => {
      this.setState({
        uiVersion: localVersion,
        upgradeAvailable,
      });
    });
    if (!this.props.accessToken) this.props.fetchAccessToken();
    // @endif

    Lbry.version().then((info) => {
      this.setState({
        versionInfo: info,
      });
    });
    Lbry.status().then((info) => {
      this.setState({
        lbryId: info.installation_id,
      });
    });
  }

  showAccessToken() {
    this.setState({
      accessTokenHidden: false,
    });
  }

  openLogFile(userHomeDirectory: string) {
    const logFileName = 'lbrynet.log';
    const os = this.state.versionInfo.os_system;
    if (os === 'Darwin' || os === 'Linux') {
      shell.openPath(`${userHomeDirectory}/${logFileName}`);
    } else {
      shell.openPath(`${userHomeDirectory}\\${logFileName}`);
    }
  }

  render() {
    let ver;
    let osName;
    let platform;
    let newVerLink;

    if (this.state.versionInfo) {
      ver = this.state.versionInfo;
      if (ver.os_system === 'Darwin') {
        osName = parseInt(ver.os_release.match(/^\d+/), 10) < 16 ? 'Mac OS X' : 'Mac OS';

        platform = `${osName} ${ver.os_release}`;
        newVerLink = 'https://lbry.com/get/lbry.dmg';
      } else if (process.env.APPIMAGE !== undefined) {
        platform = `Linux (AppImage)`;
        newVerLink = 'https://lbry.com/get/lbry.AppImage';
      } else if (ver.os_system === 'Linux') {
        platform = `Linux (${ver.platform})`;
        newVerLink = 'https://lbry.com/get/lbry.deb';
      } else {
        platform = `Windows (${ver.platform})`;
        newVerLink = 'https://lbry.com/get/lbry.msi';
      }
    } else {
      ver = null;
    }

    return (
      <Page className="card-stack">
        <h1 className="seed-h1">Madiator's Seeding Service</h1>

        <div className="notice-message">
          <h1 className="section__title">{__('How it works?')}</h1>
          <p className="section__subtitle">
            {__('Hello everyone! I decided to start own seeding service for community to help creators with distribution of their content. By running this service I hope to get donations for improving my project. Everyone is welcome to submit where small channels can be hosted for Free and bigger ones will bo hoste')}
            <Button label={__('Click here to submit channel')} button="link" href="https://next.madiator.com/apps/forms/33cfmc8s8AoKcmxs" />
          </p>
        </div>

        <p classNames="seed-p">

            <span className="rules-span">
                1.Do not request channels that host copyrighted content or NSFW.
            </span>

            <span className="rules-span">
                2.Donators can request more than 1 channel to be seeded.
            </span>

            <span className="rules-span">
                3.You can donate to seed other people content (Something like gift system).
            </span>

            <span className="rules-span">
                4.Small channels can be seed for free if they are under 100 vides.
            </span>

            <span className="rules-span">
                5.Channels above 100 videos will be reviewd based on videos file size (Current price 5.5 LBC / GB ).
            </span>

          {/*
            <span className="donation-span">
                <img src="Image URL" className="donation-icon" />
                Crypto Name: Crypto Address
            </span>
            */}
        </p>
      </Page>
    );
  }
}

export default HelpPage;
