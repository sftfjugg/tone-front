import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { history, useModel, useIntl, FormattedMessage } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { outLogin } from '@/services/login';

import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps {
    menu?: boolean;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
    await outLogin();
    const { redirect } = getPageQuery();
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: window.location.href,
            }),
        });
    }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
    const { initialState, setInitialState } = useModel('@@initialState');

    const onMenuClick = useCallback((event: ClickParam) => {
        const { key } = event;
        if (key === 'logout') {
            setInitialState({ ...initialState, authList: undefined });
            loginOut();
            return;
        }
        history.push(`/account/${key}`);
    }, []);

    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
            <Spin
                size="small"
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        </span>
    );

    if (!initialState) {
        return loading;
    }

    const { authList } = initialState;

    if (!authList || !authList.name) {
        return loading;
    }

    const menuHeaderDropdown = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            {menu && (
                <Menu.Item key="center">
                    <UserOutlined />
                    <FormattedMessage id="right.content.center" />
                </Menu.Item>
            )}
            {menu && (
                <Menu.Item key="settings">
                    <SettingOutlined />
                    <FormattedMessage id="right.content.settings" />
                </Menu.Item>
            )}
            {menu && <Menu.Divider />}

            <Menu.Item key="logout">
                <LogoutOutlined />
                <FormattedMessage id="right.content.logout" />
            </Menu.Item>
        </Menu>
    );
    return (
        <HeaderDropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={authList.avatar} alt="avatar" />
                {/* <span className={`${styles.name} anticon`}>{authList.name}</span> */}
            </span>
        </HeaderDropdown>
    );
};

export default AvatarDropdown;
