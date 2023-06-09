import React from 'react'

import { Tag, Space, Tooltip, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import cls from 'classnames'
import styles from './index.less'
import styled from "styled-components"
import { ReactComponent as CopyLink } from '@/assets/svg/TestResult/icon_link.svg'
import { useCopyText } from "@/utils/hooks"
import { useIntl } from "umi"

const LinkSpan = styled(Typography.Link)`
    position: absolute;
    right: 5px;
    top: 2px;
    &:hover {
        svg path{
            fill: #1890ff;
        }
    }
`

export const tagRender = ({ label, closable, onClose, value }: any) => {
    return (
        <Tag
            color={label.props?.color}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label.props?.children || value}
        </Tag>
    )
}

export const CopyLinkSpan: React.FC<{ onCopy: any, style?: React.CSSProperties }> = ({ onCopy, style }) => {
    const intl = useIntl()
    const handleCopyText = useCopyText(intl.formatMessage({ id: 'request.copy.success' }))
    return (
        <LinkSpan onClick={() => handleCopyText(onCopy?.())} style={style || {}}>
            <CopyLink />
        </LinkSpan>
    )
}

export const QusetionIconTootip: React.FC<any> = ({ title, desc, className }: any) => (
    <Space>
        <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{title}</span>
        <Tooltip
            overlayClassName={cls(styles.table_question_tooltip, className)}
            placement="bottom"
            arrowPointAtCenter
            title={desc}
            color="#fff"
        >
            <QuestionCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
        </Tooltip>
    </Space>
)

export const getHasMuiltip = (d: any) => {
    if (d && JSON.stringify(d) !== '{}') {
        const keys = Object.keys(d)
        for (let i = 0, len = keys.length; i < len; i++) {
            if (d[keys[i]].length > 1) return true
        }
    }
    return false
}

export const formatter = (val: any) => val && typeof +val === "number" ? parseInt(val as any) + "" : ""
