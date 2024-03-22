import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = '风风的智能BI数据分析系统';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        // {
        //   key: '风风的智能BI',
        //   title: '风风的智能BI',
        //   href: 'https://pro.ant.design',
        //   blankTarget: true,
        // },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/like45599?tab=repositories',
          blankTarget: true,
        },
        {
          key: '风风的智能BI',
          title: '风风的智能BI',
          href: 'https://github.com/like45599?tab=repositories',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
