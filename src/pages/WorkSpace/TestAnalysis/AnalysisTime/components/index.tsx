export function textTip(title: string, data: any) {
    return data ? `${title}：${data}<br />` : ''
}

export function commitLinkTip( title:string, commit: any, ws_id: any ) {
    return commit ? `${title}: <a href=${`/ws/${ws_id}/test_result/${commit}`} target="_blank">#${commit}</a><br />` : ''
}

export function serverLinkTip(ip: any) {
    return ip ?
        `测试机器: <span>${ip}</span><br />` :
        ''
}

export const renderProviderText = (i: any, provider: string) => {
    return `${provider === '' ? `规格 : ${i.seriesName}<br />
                    Image: ${i.seriesName}<br />
                    Bandwidth: ${i.seriesName}<br />
                    RunMode: ${i.seriesName}<br />` : ''}`
}