import AvatarCover from "@/components/AvatarCover"
import { Avatar, Button, Space, Typography } from "antd"
import React from "react"
import styled from "styled-components"
import { history, useModel, useIntl, useAccess } from "umi"
import ApplyJoinWorkspace from '@/components/ApplyJoinPopover'

import { enterWorkspaceHistroy } from '@/services/Workspace'

import { ReactComponent as PublicIcon } from '@/assets/svg/public.svg'
import { ReactComponent as NPublicIcon } from '@/assets/svg/no_public.svg'
import { jumpWorkspace, requestCodeMessage } from '@/utils/utils'

const TableCellColumn = styled.div`
    background-color: #FFFFFF;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,0.15);
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 48px;
    width: 100%;
    padding: 0 20px;
    cursor: pointer;
    &:hover {
        box-shadow: 0 3px 20px 0 rgba(0,0,0,0.20);
        z-index: 20;
        /* .ant-btn {
            display: block;
        } */
    }
`

const intrWidth = "255px"
const ownerWidth = "156px"
const OperateWidth = "120px"

const Intr = styled.div`
    height: 100%;
    width: ${intrWidth};
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
`

const Owner = styled.div`
    width: ${ownerWidth};
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`

const Operations = styled.div`
    width: ${OperateWidth};
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: end;
    .ant-btn {
        /* display: none; */
        margin: 0 !important;
    }
    
`

const Desc = styled(Typography.Text)`
    width: calc(100% - ${intrWidth} - ${ownerWidth} - ${OperateWidth});
`

export const getEnterWorkspaceState = async (record: any, user_id: any) => {
    const { code, msg, first_entry } = await enterWorkspaceHistroy({ ws_id: record.id })
    if (code === 200) {
        const path = first_entry && record.creator === user_id ?
            `/ws/${record.id}/workspace/initSuccess` :
            jumpWorkspace(record.id)

        return path
    }
    else requestCodeMessage(code, msg)
    history.push('/500')
    return ''
}

export const TableRow: React.FC<Record<string, any>> = (props) => {
    const { show_name, is_public, description, avatar, owner_name, id, is_member } = props

    const access = useAccess()
    const intl = useIntl()
    const { initialState } = useModel("@@initialState")
    const { user_id, login_url } = initialState?.authList || {}

    const ref = React.useRef<any>(null)

    const handleJumpWs = async () => {
        const path: string = await getEnterWorkspaceState(props, user_id)
        path && history.push({ pathname: path, state: { fetchWorkspaceHistoryRecord: true } })
    }

    /* const handleLogin = () => {
        if (BUILD_APP_ENV === 'openanolis') {
            return window.location.href = login_url
        }
        return history.push(`/login?redirect_url=${jumpWorkspace(id)}`)
    } */

    const renderOperationButton = () => {
        /* 公开ws 未登录跳登录 */
        //私密ws 未登录跳转登录
        /* 未登录，私密不显示按钮 */
        if (!user_id && !is_public) {
            return <></>
            /* return (
                <Button type="primary" onClick={handleLogin}>
                    {
                        intl.formatMessage({ id: `pages.anolis_home.button.apply_join` })
                    }
                </Button>
            ) */
        }

        if (access.IsAdmin() || is_member)
            return (
                <Button onClick={handleJumpWs}>
                    {intl.formatMessage({ id: `pages.anolis_home.button.enter` })}
                </Button>
            )
        /* else {
            if (is_public)
                return (
                    <Button type="primary" onClick={handleJumpWs}>
                        {intl.formatMessage({ id: `pages.anolis_home.button.tourist_test` })}
                    </Button>
                )
        } */

        return (
            <ApplyJoinWorkspace
                onRef={ref}
                ws_id={id}
                btnText={intl.formatMessage({ id: `pages.anolis_home.button.join` })}
            />
        )
    }

    const handleClick = () => {
        if (BUILD_APP_ENV) {
            if (!user_id && !is_public) return
        }
        // if (!user_id && !is_public) return handleLogin()
        if (is_member || is_public) return handleJumpWs()
        return ref.current?.show()
    }

    return (
        <TableCellColumn
            onClick={handleClick}
        >
            <Intr >
                <AvatarCover {...props} size={32} />
                <Space size={4}>
                    <Typography.Text
                        ellipsis={{ tooltip: true }}
                        style={{ maxWidth: "calc(255px - 12px - 32px - 20px - 8px)" }}
                    >
                        {show_name}
                    </Typography.Text>
                    {is_public ? <PublicIcon /> : <NPublicIcon />}
                </Space>
            </Intr>

            <Owner >
                <Avatar src={avatar} size={25} />
                <Typography.Text ellipsis={{ tooltip: true }}>{owner_name}</Typography.Text>
            </Owner>

            <Desc ellipsis={{ tooltip: true }}>{description}</Desc>
            <Operations>
                {
                    renderOperationButton()
                }
            </Operations>
        </TableCellColumn>
    )
}


const HeaderRow = styled.div`
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-direction: row;

    ${Intr},
    ${Owner},
    ${Desc} {
        font-weight: 400;
        font-size: 12px;
        color: rgba(0,0,0,.45);
    }
`

export const TableHeader: React.FC = () => {

    return (
        <HeaderRow>
            <Intr >Workspace名称</Intr>
            <Owner >所有者</Owner>
            <Desc >简介</Desc>
        </HeaderRow>
    )
}