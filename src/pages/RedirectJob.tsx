import { Spin } from 'antd'
import React, { useEffect } from 'react'
import { request , history } from 'umi'

const RedirectJob = ( props: any  ) => {
    const { job_id } = props.match.params
    const queryJobInfo = async ( ) => {
        const { data , code  } = await request(`/api/job/test/?job_id=${ job_id }`)
        if ( code !== 200 ) history.push(`/404`)
        if ( data.length > 0 ) {
            const { ws_id } = data[0]
            history.push(`/ws/${ ws_id }/test_result/${ job_id }`)
        }
    }

    useEffect(() => {
        queryJobInfo()
    } , [])
    return (
        <Spin spinning={ true }/>
    )
}

export default RedirectJob