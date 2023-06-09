import React from 'react'
import { queryCaseResultFile } from '../service'
import { useRequest, request, useParams, useIntl } from 'umi'
import { Tree, Spin, Empty, message, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';

import styles from './index.less'

const TreeFileIcon: React.FC<any> = (props: any) => (
    <>
        {
            props.items.length > 0 ?
                <span className={styles.dir_icon} /> :
                <span className={styles.file_icon} />
        }
    </>
)

export default ({ test_case_id, suite_id }: any) => {
    const { formatMessage } = useIntl()
    const { id: job_id } = useParams() as any

    const handlePathClick = async (ctx: any, job_id: number | string, state: string) => {
        let obj = {}
        if (state == 'download') {
            obj = { path: ctx.path, job_id, download: '1' }
        }
        if (state == 'look') {
            obj = { path: ctx.path, job_id }
        }
        const data = await request(`/api/get/oss/url/`, { params: obj })
        if (data) {
            if (data.code === 200 && data.msg === 'ok') window.open(data.data)
            else message.warn(`${state === 'download' ? formatMessage({ id: 'ws.result.details.failed.download.file' }) : formatMessage({ id: 'ws.result.details.failed.get.file' })}`)
        }
    }

    const RenderItem = (ctx: any, job_id: any) => {
        return (
            <Space>
                <span onClick={() => handlePathClick(ctx, job_id, 'look')}>{ctx.name}</span>
                {!ctx.items.length && <DownloadOutlined onClick={() => handlePathClick(ctx, job_id, 'download')} />}
            </Space>
        )
    }
    const treeDataMap = (item: any, index: string | number, job_id: string | number): Array<any> => (
        item.map((ctx: any, idx: number) => (
            {
                ...ctx,
                title: RenderItem(ctx, job_id),
                key: `${index}-${idx}`,
                icon: (p: any) => <TreeFileIcon {...p} />,
                children: ctx.items && ctx.items.length > 0 ? treeDataMap(ctx.items, `${index}-${idx}`, job_id) : [],
            }
        ))
    )

    const { data, loading }: any = useRequest(
        () => queryCaseResultFile({ job_id, case_id: test_case_id, suite_id }),
        {
            initialData: [],
            formatResult: res => {
                if (res.code === 200) {
                    return treeDataMap(res.data, 0, job_id)
                }
                return []
            },
        }
    )

    const handleOpenOss = async (path: string) => {
        const data = await request(`/api/get/oss/url/`, { params: { path, job_id } })
        if (data) {
            if (data.code === 200 && data.msg === 'ok') window.open(data.data)
            else message.warn(formatMessage({ id: 'ws.result.details.failed.get.file' }))
        }
    }

    const mapChildKey = (arr: any, clickKey: any): any => {
        if (!arr.length) return
        for (let x = 0; x < arr.length; x++) {
            let item = arr[x]
            if ((item.key === clickKey) && item.path)
                return handleOpenOss(item.path)
            item.children.length > 0 && mapChildKey(item.children, clickKey)
        }
    }

    return (
        <div style={{ minHeight: 50 }}>
            <Spin spinning={loading}>
                {
                    data.length > 0 ?
                        <Tree
                            style={{ padding: 20 }}
                            treeData={data}
                            showIcon={true}
                        /> :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
            </Spin>
        </div>
    )
}