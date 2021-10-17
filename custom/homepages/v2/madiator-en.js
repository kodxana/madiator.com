//module.exports = {
//  LINUX,
//};

//const PRIMARY_CONTENT_CHANNEL_IDS = [
//e15f8434e6fd76b05f0b6c2918f71a7f29b93f7e,
//];

//const PRIMARY_CONTENT = {
//  channelIds: PRIMARY_CONTENT_CHANNEL_IDS,
//  name: 'general',
//  sortOrder: 1,
//  icon: 'Cheese',
//  label: 'Cheese',
//  channelLimit: 'auto',
//  daysOfContent: 180,
//  pageSize: 24,
  //pinnedUrls: ['lbry://@RationalAnimations#1/humanity-was-born-way-ahead-of-its-time.#5',]
  //mixIn: [],
//};

import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import { parseURI } from 'lbry-redux';
import moment from 'moment';
import { toCapitalCase } from 'util/string';
import React from 'react';
import Icon from 'component/common/icon';

export type RowDataItem = {
  title: string,
  link?: string,
  help?: any,
  options?: {},
};

export default function GetHomePageRowData(
  authenticated: boolean,
  showPersonalizedChannels: boolean,
  showPersonalizedTags: boolean,
  subscribedChannels: Array<Subscription>,
  followedTags: Array<Tag>,
  showIndividualTags: boolean
) {
  let rowData: Array<RowDataItem> = [];
  const individualTagDataItems: Array<RowDataItem> = [];

  const TOP_CONTENT_TODAY = {
    title: 'Top Content from Today',
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_DAY}`,
    options: {
      pageSize: 12,
      orderBy: ['effective_amount'],
      claimType: ['stream'],
      releaseTime: `>${Math.floor(
        moment()
          .subtract(1, 'day')
          .startOf('day')
          .unix()
      )}`,
    },
  };

  const TOP_CHANNELS = {
    title: 'Top Channels On LBRY',
    link: `/$/${PAGES.DISCOVER}?claim_type=channel&${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TOP}&${CS.FRESH_KEY}=${CS.FRESH_ALL}`,
    options: {
      orderBy: ['effective_amount'],
      claimType: ['channel'],
    },
  };

  const TRENDING_CLASSICS = {
    title: 'Trending Classics',
    link: `/$/${PAGES.DISCOVER}?${CS.ORDER_BY_KEY}=${CS.ORDER_BY_TRENDING}&${CS.FRESH_KEY}=${CS.FRESH_WEEK}`,
    options: {
      pageSize: 6,
      claimType: ['stream'],
      releaseTime: `<${Math.floor(
        moment()
          .subtract(6, 'month')
          .startOf('day')
          .unix()
      )}`,
    },
  };

  const TRENDING_ON_LBRY = {
    title: 'Trending On LBRY',
    link: `/$/${PAGES.DISCOVER}`,
    options: {
      pageSize: showPersonalizedChannels || showPersonalizedTags ? 4 : 8,
    },
  };

  const TRENDING_FOR_TAGS = {
    title: 'Trending For Your Tags',
    link: `/$/${PAGES.TAGS_FOLLOWING}`,
    options: {
      tags: followedTags.map(tag => tag.name),
      claimType: ['stream'],
    },
  };

  const LATEST_FROM_LBRY = {
    title: 'Latest From @Madiator2011',
    link: `/@Madiator2011:e`,
    options: {
      orderBy: ['release_time'],
      pageSize: 8,
      channelIds: ['e15f8434e6fd76b05f0b6c2918f71a7f29b93f7e'],
    },
  };

  const LATEST_FROM_LBRYCAST = {
    title: 'Latest From @blenderdumbass',
    link: `/@blenderdumbass:f`,
    options: {
      orderBy: ['release_time'],
      pageSize: 4,
      channelIds: ['fd60b4b0b82f7f4e870c956ab61e9137b7c54680'],
    },
  };

//  const LINUX_CHANNEL_IDS = [
//  '5d5770bc07e5727320d5e18680867cbe47ae72bd',
//  'e5d96ea3720b01cca537c6d90f38e8c11ff06a0a',
//  ];
//  const LINUXI = {
//    channelIds: LINUX_CHANNEL_IDS,
//   name: 'linux',
//    sortOrder: 40,
//  icon: 'Speaker',
// label: 'Linux',
//  channelLimit: 'auto',
//  daysOfContent: 180,
//  pageSize: 24,
//};


  if (showPersonalizedChannels) rowData.push(RECENT_FROM_FOLLOWING);
  if (showPersonalizedTags && !showIndividualTags) rowData.push(TRENDING_FOR_TAGS);
  if (showPersonalizedTags && showIndividualTags) {
    individualTagDataItems.forEach((item: RowDataItem) => {
      rowData.push(item);
    });
  }
  rowData.push(TOP_CONTENT_TODAY);
  rowData.push(LATEST_FROM_LBRY);
  rowData.push(LATEST_FROM_LBRYCAST);
  rowData.push(TRENDING_ON_LBRY);
  rowData.push(TOP_CHANNELS);
  rowData.push(TRENDING_CLASSICS);
  return rowData;
}

