
import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Badge } from 'antd';
import styles from './msg.less'
import { useModel, history } from 'umi';
import TaskInformIndex from '@/pages/MsgDetail/TaskInformIndex'
import SystemInformIndex from '@/pages/MsgDetail/SystemInformIndex'
const msg: React.FC<any> = () => {
    //let state = history.location.state
    let state = window.location.search.substring(1)
    const [layoutHeight, setLayoutHeight] = useState(innerHeight)
    const [tab, setTab] = useState(state === 'task' ? '1' : '2')
    const { TabPane } = Tabs;
    const windowHeight = () => setLayoutHeight(innerHeight)
    const { msgNum } = useModel('msg');
    // tab切换
    const handleTabClick = (tab: string) => {
        setTab(tab)
    }
    document.title = '消息通知 T-One'
    useEffect(() => {
        window.addEventListener('resize', windowHeight)
        return () => {
            window.removeEventListener('resize', windowHeight)
        }
    }, [])
    return (
        <Layout style={{ padding: '14px 20px 0 20px', height: layoutHeight - 50, minHeight: 0, overflow: 'auto' }}>
            <Layout.Content style={{ background: '#fff' }}>
                <div className={styles.msg_warp}>
                    <div className={styles.msg_notice}>消息通知</div>
                    <Tabs defaultActiveKey={tab} onChange={handleTabClick}>
                        <TabPane tab={msgNum?.task_msg_unread_num > 0 ? <Badge dot={msgNum?.task_msg_state}>任务通知</Badge> : '任务通知'} key="1">
                            {tab === '1' && <TaskInformIndex tab={tab} height={layoutHeight - 50} />}
                        </TabPane>
                        <TabPane tab={<Badge count={msgNum?.apply_msg_unread_num} offset={[msgNum?.apply_msg_unread_num < 10 ? 6 : 12, 0]}>系统通知</Badge>} key="2">
                            {tab === '2' && <SystemInformIndex tab={tab} height={layoutHeight - 50} />}
                        </TabPane>
                    </Tabs>
                </div>
            </Layout.Content>
        </Layout>
    )
}
export default msg;
