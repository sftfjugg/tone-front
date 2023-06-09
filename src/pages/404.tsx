import { Layout } from 'antd';
import React, { useEffect } from 'react';
import Icon from '@/assets/img/loss.png';
import { useClientSize } from '@/utils/hooks';

const NoFoundPage: React.FC<{}> = () => {
    useEffect(() => {
        const otitle = document.getElementsByTagName("title")[0]
        if (otitle) otitle.innerText = '404页面'
    }, [])

    const { height: layoutHeight } = useClientSize()

    return (
        <Layout.Content style={{ background: '#fff' }}>
            <div style={{ backgroundColor: '#fff', height: layoutHeight }}>
                <div style={{ textAlign: 'center', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}>
                    <div>
                        <div style={{ display: 'inline-block' }}>
                            <img alt="icon" src={Icon}></img>
                        </div>
                        <div style={{ textAlign: 'left', display: 'inline-block', marginLeft: 80 }}>
                            <div style={{ color: '#000', fontSize: 48, opacity: 0.85, fontWeight: 'bold' }}>抱歉，页面无法访问…</div>
                            <div style={{ color: '#000', fontSize: 16, opacity: 0.45, marginTop: 20 }}>页面链接可能已失效或被删除</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout.Content>
    )
}

export default NoFoundPage;
