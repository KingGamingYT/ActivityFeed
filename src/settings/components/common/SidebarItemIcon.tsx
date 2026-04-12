import SettingsClasses from "@settings/ActivityFeedSettings.module.css";

export function NewspaperIcon() {
    return (
        <svg 
            className={SettingsClasses.newspaperIcon}
            role="img"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <defs>
                <mask id="newspaper-mask">
                    <rect width="24" height="24" fill="#fff" stroke="none" />
                    <g stroke="#000">
                        <path d="M15 18h-5" />
                        <path d="M18 14h-8" />
                        <path d="M10 6h8v4h-8V6Z" />
                    </g>
                </mask>
            </defs>
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z" fill="currentColor" mask="url(#newspaper-mask)" />
            <path d="M4 22a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        </svg>
    )
}