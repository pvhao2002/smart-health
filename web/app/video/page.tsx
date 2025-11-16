'use client';

import {useSearchParams} from 'next/navigation';

export default function VideoPage() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get('videoId');

    const src = videoId
        ? `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1&playsinline=1&showInfo=0&controls=1&fullscreen=1`
        : '';

    return (
        <div style={styles.container}>
            {src ? (
                <iframe
                    id="thisIframe"
                    src={src}
                    style={styles.iframe}
                    allowFullScreen
                />
            ) : (
                <div style={styles.error}>Missing videoId</div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: '100%',
        height: '100vh',
        backgroundColor: 'black',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
    },
    iframe: {
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        overflow: 'hidden',
    },
    error: {
        color: 'white',
        fontSize: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
};
