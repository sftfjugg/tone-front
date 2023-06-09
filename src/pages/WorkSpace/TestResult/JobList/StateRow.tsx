import { Row, Space, Typography, Radio, Input, RadioChangeEvent } from "antd"
import React from "react"
import styled from "styled-components"
import { useAccess, useLocation, useParams, useIntl, FormattedMessage } from "umi"
import { DownOutlined, UpOutlined } from '@ant-design/icons'

const activeCss = `
    color: #1890FF;
`

type ActiveStateProps = {
    active?: boolean
}

const BaseState = styled.span<ActiveStateProps>`
    cursor: pointer;
    ${({ active }) => active ? activeCss : ""}
`

type IProps = {
    [k: string]: any;
}

const StateRow: React.FC<IProps> = (props) => {
    const { formatMessage } = useIntl()
    const { pageQuery, setPageQuery, stateCount, onSelectionChange, onFilterChange } = props

    const { ws_id } = useParams() as any
    const { query } = useLocation() as any
    const access = useAccess()

    const { state } = pageQuery

    const [inp, setInp] = React.useState("")
    const [filter, setFilter] = React.useState(JSON.stringify(query) !== "{}")
    const [keyType, setKeyType] = React.useState(1)

    /* filter change */
    React.useEffect(() => {
        onFilterChange && onFilterChange(filter)
    }, [filter])

    /* selection type change */
    React.useEffect(() => {
        onSelectionChange && onSelectionChange(keyType)
    }, [keyType])

    const jobStateKeys = [
        { name: formatMessage({ id: 'all' }), key: 'all_job', val: undefined, },
        { name: 'Pending', key: 'pending_job', val: 'pending' },
        { name: 'Running', key: 'running_job', val: 'running' },
        { name: 'Complete', key: 'success_job', val: 'success' },
        { name: 'Fail', key: 'fail_job', val: 'fail' },
    ]

    return (
        <Row justify="space-between" style={{ height: 48, padding: "0 20px" }}>
            <Space size="large">
                {
                    jobStateKeys.map((item: any) => (
                        <BaseState
                            active={state === item.val}
                            key={item.key}
                            onClick={
                                () => setPageQuery((p: any) => ({ ...p, state: item.val }))
                            }
                        >
                            {`${item.name}(${stateCount ? stateCount[item.key] : 0})`}
                        </BaseState>
                    ))
                }
            </Space>

            <Space>
                <Space>
                    <Typography.Text><FormattedMessage id="ws.result.list.selection.function" />：</Typography.Text>
                    <Radio.Group
                        onChange={({ target }: RadioChangeEvent) => setKeyType(target.value)}
                        value={keyType}
                    >
                        <Radio value={1}><FormattedMessage id="ws.result.list.report.and.analysis" /></Radio>
                        {access.WsMemberOperateSelf() && <Radio value={2}><FormattedMessage id="ws.result.list.batch.delete" /></Radio>}
                    </Radio.Group>
                </Space>
                <Input.Search
                    style={{ width: 160 }}
                    allowClear
                    value={inp}
                    onChange={({ target }) => setInp(target.value)}
                    onPressEnter={() => setPageQuery((p: any) => ({ ...p, search: inp.replaceAll(" ", "") }))}
                    onSearch={(val) => setPageQuery((p: any) => ({ ...p, search: val.replaceAll(" ", "") }))}
                />
                <div onClick={() => setFilter(!filter)} style={{ cursor: 'pointer' }}>
                    {
                        filter ?
                            <Space><FormattedMessage id="ws.result.list.collapse.filter" /><UpOutlined /></Space> :
                            <Space><FormattedMessage id="ws.result.list.expand.filter" /><DownOutlined /></Space>
                    }
                </div>
            </Space>
        </Row>
    )
}

export default StateRow