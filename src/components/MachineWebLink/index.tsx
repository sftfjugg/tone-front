import React, { useEffect, useRef, useState } from 'react';
import { requestCodeMessage } from '@/utils/utils'
import { querySeverLink } from '@/pages/WorkSpace/TestResult/Details/service'
import { useAccess } from 'umi'
import { Tooltip } from 'antd';
import styled from 'styled-components';
interface ServerType {
    val: string | number,
    param?: string | number,
    provider: "aligroup" | "aliyun",
    description?: string,
    machine_pool?:boolean,
}
const TextWarp = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`
const ServerLink: React.FC<ServerType> = ({ val, param, provider, description, machine_pool = false }) => {
    const access = useAccess();
    const ellipsis = useRef<any>(null)
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {
        setEllipsis();
    }, [val])

    const setEllipsis = () => {
        const clientWidth = ellipsis?.current?.clientWidth
        const scrollWidth = ellipsis?.current?.scrollWidth
        setShow(clientWidth < scrollWidth)
    }

    const handleIpHerf = async () => {
        if (provider === "aliyun") {
            let params = machine_pool ? { server_id: param } : { id: param }
            const { data, code, msg } = await querySeverLink(params)
            if (code === 200) {
                const win: any = window.open("");
                setTimeout(function () { win.location.href = data.link })
            }
            requestCodeMessage(code, msg)
        } else {
            return
            // 内网机器IP/SN跳转terminal处理方法 勿删除
            // const href = getTerminalLink(val)
            // const win: any = window.open("");
            // setTimeout(function () { win.location.href = href })
        }
    }
    const flag = 
        (BUILD_APP_ENV && provider === "aligroup") || 
        (provider === "aliyun" && !access.IsAdmin()) || 
        (!BUILD_APP_ENV && provider === "aligroup" && !access.IsWsSetting())
        
    const TypographyDiv = flag ? (<TextWarp ref={ellipsis}>{val || '-'}</TextWarp>)
        : (
            <TextWarp ref={ellipsis} style={{ color: '#1890ff', cursor: 'pointer' }} onClick={handleIpHerf}>
                {val || '-'}
            </TextWarp>
        )

    const machineDesc = (
        <>
            <div>机器IP：{val}</div>
            <div>机器备注：{description}</div>
        </>
    )

    if (val) {
        if(!show && description){
            return (
                <Tooltip title={description} placement="topLeft" overlayStyle={{ wordBreak: 'break-all' }}>
                    {TypographyDiv}
                </Tooltip> 
            )
        }
        if(show && description){
            return (
                <Tooltip title={machineDesc} placement="topLeft" overlayStyle={{ wordBreak: 'break-all' }}>
                    {TypographyDiv}
                </Tooltip> 
            )
        }
        if(show){
            return (
                <Tooltip title={val} placement="topLeft" overlayStyle={{ wordBreak: 'break-all' }}>
                    {TypographyDiv}
                </Tooltip>
            )
        }
        return TypographyDiv;
    }
    return <span>-</span>
}
export default ServerLink;
