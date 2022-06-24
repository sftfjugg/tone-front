import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useParams } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const RenderMachinePrompt = (props: any) => {
    const { aliyun_is_instance_release, cluster_msg, server_occupied, provider_name } = props;
    const { ws_id } = useParams<any>();
    const isEmptyStr = (str: string) => {
        if (str && typeof str == 'string' && str.length > 0) {
            return true;
        }
        return false;
    }

    if (isEmptyStr(aliyun_is_instance_release)) {
        return (
            <div style={{ background: '#FFFBE6', border: '1px solid #FFE58F', marginBottom: 10 }}>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={24}>
                        <ExclamationCircleOutlined style={{ color: '#FAAD14', padding: '16px 18px 0 26px' }} />
                        <Typography.Text style={{ paddingTop: 16, fontFamily: 'PingFangSC-Medium', color: 'rgba(0,0,0,0.85)' }}>云上机器实例已释放</Typography.Text>
                        <Row style={{ padding: '4px 0 0 60px' }}>
                            <Typography.Text style={{ fontFamily: 'PingFangSC-Medium', color: 'rgba(0,0,0,0.65)', marginRight: 8 }}>{aliyun_is_instance_release}</Typography.Text>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
    if (isEmptyStr(cluster_msg)) {
        return (
            <div style={{ background: '#FFFBE6', border: '1px solid #FFE58F', marginBottom: 10 }}>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={24}>
                        <ExclamationCircleOutlined style={{ color: '#FAAD14', padding: '16px 18px 0 26px' }} />
                        <Typography.Text style={{ paddingTop: 16, fontFamily: 'PingFangSC-Medium', color: 'rgba(0,0,0,0.85)' }}>集群机器配置错误</Typography.Text>
                        <Row style={{ padding: '4px 0 0 60px' }}>
                            <Typography.Text style={{ fontFamily: 'PingFangSC-Medium', color: 'rgba(0,0,0,0.65)', marginRight: 8 }}>
                                <a href={provider_name.indexOf('云上') !== -1 ? `/ws/${ws_id}/device/cloud` : `/ws/${ws_id}/device/group`} target='_blank'>{cluster_msg}</a>
                            </Typography.Text>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
    if (server_occupied && !!server_occupied.length) {
        return (
            <div style={{ background: '#FFFBE6', border: '1px solid #FFE58F', marginBottom: 10 }}>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={24}>
                        <ExclamationCircleOutlined style={{ color: '#FAAD14', padding: '16px 18px 0 26px' }} />
                        <Typography.Text style={{ paddingTop: 16, fontFamily: 'PingFangSC-Medium', color: 'rgba(0,0,0,0.85)' }}>机器被Job占用</Typography.Text>
                        <Row style={{ padding: '4px 0 0 60px' }}>
                            <Typography.Text style={{ fontFamily: 'PingFangSC-Medium', color: 'rgba(0,0,0,0.65)', marginRight: 8 }}>占用Job</Typography.Text>
                            {
                                server_occupied.map((item: any) => (
                                    <span style={{ marginRight: 20 }} onClick={()=> setTimeout(function () { window.location.href = `/ws/${ws_id}/test_result/${item.job_id}`})}>
                                        {item.job_name}/{item.job_id}
                                    </span>
                                ))
                            }
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
    return <></>
}
export default RenderMachinePrompt;