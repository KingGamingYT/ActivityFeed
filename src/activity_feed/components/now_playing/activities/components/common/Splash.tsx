export default function ({splash, className}) {
    if (!splash) return;

    return <div className={className} style={{ backgroundImage: `url(${splash})` }} />
}