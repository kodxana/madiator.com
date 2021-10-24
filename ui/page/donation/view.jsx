// @flow
import * as React from 'react';
// @if TARGET='app'
import { shell } from 'electron';
// @endif
import { Lbry } from 'lbry-redux';
import Native from 'native';
import Button from 'component/button';
import Page from 'component/page';
import 'scss/component/_donation';

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
        <h1 className="donation-h1">Donations</h1>

        <div className="notice-message">
          <h1 className="section__title">{__('Help LBRY Save Crypto')}</h1>
          <p className="section__subtitle">
            {__('The US government is attempting to destroy the cryptocurrency industry. Can you help?')}{' '}
            <Button label={__('Learn more and sign petition')} button="link" href="https://helplbrysavecrypto.com" />
          </p>
        </div>

        <p className="donation-p">
          <span className="donation-span">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/4027.png" className="donation-icon" />
            DeVault: qrup4teghgza9ylxqd2cdawmdwyyhwd5vv4s00rn5c
          </span>
          <span className="donation-span">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1298.png" className="donation-icon" />
            LBRY Credits: bXeBKSjPygVbvkBH79Bp6CxiyeRC2hpVQ3
          </span>
          <span className="donation-span">
            <img src="https://cointr.ee/static/media/btc.ea6d0c84.png" className="donation-icon" />
            Bitcoin:
          </span>
          <span className="donation-span">
            <img src="https://cointr.ee/static/media/eth.6d288663.png" className="donation-icon" />
            Ethereum:
          </span>
          <span className="donation-span">
            <img src="https://cointr.ee/static/media/ltc.14cfbc4c.png" className="donation-icon" />
            Litecoin:
          </span>
          <span className="donation-span">
            <img src="https://cointr.ee/static/media/dash.59d339da.png" className="donation-icon" />
            Dash:
          </span>
          <span className="donation-span">
            <img src="https://cointr.ee/static/media/doge.fb74d36c.png" className="donation-icon" />
            Dogecoin:
          </span>
          <span className="donation-span">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png" className="donation-icon" />
            Algorand: LJF6DQHBA475GUANNWK4JPSK22MWYXX2YY7M7IT3Q43CDVYXKXGE3TYVQA
          </span>
          <span className="donation-span">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1521.png" className="donation-icon" />
            Komodo: RLZWLmLQGYA29gMLYkxJ1A2MM21ALfSa88
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
