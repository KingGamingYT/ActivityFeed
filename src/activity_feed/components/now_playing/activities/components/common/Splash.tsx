interface Splash {
    splash: string,
    className: string
}

export default function ({splash, className}: Splash) {
    if (!splash) return;

    return <div className={className} style={{ backgroundImage: `url(${splash})` }} />
}