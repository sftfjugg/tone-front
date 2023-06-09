import { useEffect } from 'react'
import { history, useModel, useParams, useLocation } from 'umi'
import { person_auth } from '@/services/user';
import { enterWorkspaceHistroy } from '@/services/Workspace';

export default (props: any) => {
    const { children } = props
    const locationHistory = useLocation()
    const { ws_id } = useParams() as any
    const { initialState, setInitialState } = useModel('@@initialState')
    const { authList, fetchHistory } = initialState

    const getHistoryFetcher = () => enterWorkspaceHistroy({ ws_id })
        .then((res) => {
            const { code } = res
            if (code === 200)
                setInitialState((p: any) => ({
                    ...p,
                    authList: { ...p.authList, first_entry: false },
                    fetchHistory: true
                }))
        })

    const checkAccess = async () => {
        let flag = authList
        const { ws_id: old_ws_id } = authList

        if (!old_ws_id || old_ws_id !== ws_id) {
            const { data } = await person_auth({ ws_id })
            setInitialState({ ...initialState, authList: { ...data, ws_id } })
            flag = data

            /* 切换ws请求记录历史接口 */
            getHistoryFetcher()

            if (data.first_entry && data.ws_role_title === "ws_owner") {
                history.push(`/ws/${ws_id}/workspace/initSuccess`)
                return
            }
            /* 历史记录接口调取 */
            if (!data) {
                history.push(`/500?page=${location.href}`)
                return
            }
        }

        /* 刷新直接进入ws，有ws_id但无记录，没有请求过history，请求记录历史接口 */
        if (!fetchHistory) getHistoryFetcher()

        const { ws_role_title, ws_is_exist, sys_role_title } = flag

        if (!ws_is_exist) {
            history.push(`/404`)
            return
        }

        if (sys_role_title !== 'sys_admin' && !ws_role_title) {
            history.push({ pathname: '/401', state: ws_id })
            return
        }
    }

    useEffect(() => {
        checkAccess()
    }, [locationHistory.pathname])

    return children
}