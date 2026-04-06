import { Webpack } from "betterdiscord";
import MainClasses from "./ActivityFeed.module.css";
import FeedClasses from "./components/application_news/ApplicationNews.module.css";
import NowPlayingClasses from "./components/now_playing/NowPlaying.module.css";
import QuickLauncherClasses from "./components/quick_launcher/QuickLauncher.module.css";
import SettingsClasses from "../settings/ActivityFeedSettings.module.css";

const styles = Object.assign({
        wrapper: Webpack.getByKeys('wrapper', 'svg', 'mask').wrapper,
        customButtons: Webpack.getByKeys('customButtons', 'absolute').customButtons,
        hasText: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).hasText,
        sm: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).sm,
        interactiveSelected: Webpack.getByKeys('icon', 'upperContainer').interactiveSelected,
        lookFilled: Webpack.getByKeys('colorPrimary', 'grow').lookFilled,
        colorPrimary: Webpack.getByKeys('colorPrimary', 'grow').colorPrimary,
        contents: Webpack.getByKeys('colorPrimary', 'grow').contents
    },
    Object.getOwnPropertyDescriptors(Webpack.getByKeys('itemCard')),
    Object.getOwnPropertyDescriptors(Webpack.getByKeys('tabularNumbers')),
    Object.getOwnPropertyDescriptors(Webpack.getByKeys('bar', 'container', 'progress')),
    Object.getOwnPropertyDescriptors(Webpack.getModule(x=>x.buttonContainer && Object.keys(x).length === 1)),
    MainClasses,
    FeedClasses,
    NowPlayingClasses,
    QuickLauncherClasses,
    SettingsClasses,
);

export const extraCSS = webpackify(`
    .nowPlayingColumn .tabularNumbers {
        color: var(--text-default) !important;
    }

    .nowPlayingColumn :is(.actionsActivity, .customButtons) {
        gap: 8px;
    }

    .customButtons {
        display: flex;
        flex-direction: column;
    }

    .headerActions {
        .button.lookFilled {
            background: var(--control-secondary-background-default);
            border: unset;
            color: var(--white);
            padding: 2px 16px;
            width: unset;
            svg {
                display: none;
            } 
        }
        .button.lookFilled:hover {
            background-color: var(--control-secondary-background-hover) !important;
        }
        .button.lookFilled:active {
            background-color: var(--control-secondary-background-active) !important; 
        }
        .lookFilled.colorPrimary {
            background: unset !important;
            border: unset !important;
        }
        .lookFilled.colorPrimary:hover {
            color: var(--interactive-background-hover);
            svg {
                stroke: var(--interactive-background-hover);
            }
        }
        .lookFilled.colorPrimary:active {
            color: var(--interactive-background-active);
            svg {
                stroke: var(--interactive-background-active);
            }
        }
    }

    .activityContainer:last-child:not(:only-child, :nth-child(1 of .activityContainer)) .sectionDivider {
        display: none;
    }

    .nowPlaying .sectionDivider:last-child {
        display: none;
    }

    .activity .serviceButtonWrapper .sm:not(.hasText) {
        padding: 0;
        width: calc(var(--custom-button-button-sm-height) + 4px);
    }

    .content .bar {
        background-color: var(--opacity-white-24);
    }

    .partyStatusWrapper .disabledButtonWrapper {
        flex: 1;
    }

    .partyStatusWrapper .disabledButtonOverlay {
        height: 24px;
        width: 100%;
    }

    .lastPlayedPlayer .button {
        display: none;
        width: unset;
        align-self: center;
    }

    .lastPlayedPlayer:hover .button {
        display: block;
    }

    .cardV2 {
        .headerActions .button.lookFilled, .cardBody button {
            color: var(--white);
            background: var(--opacity-white-24) !important;
            &:hover {
                background: var(--opacity-white-36) !important;
            }
            &:active {
                background: var(--opacity-white-32) !important;
            }
        }
        .tabularNumbers {
            color: var(--app-message-embed-secondary-text) !important;
        }
        .bar {
            background-color: var(--opacity-white-24);
        }
        .progress {
            background-color: var(--white);
        }
        .sectionDivider {
            border-color: var(--opacity-white-12) !important;
            border-width: 1px;
            margin: 12px 0 12px 0;
        }
        .news {
            background-color: hsl(var(--black-hsl) / .7);
            border-radius: var(--radius-sm);
            margin-top: var(--space-sm);
            outline: 1px solid var(--border-muted);
            outline-offset: -1px;
            padding: var(--space-lg);
            z-index: 0;
            .background {
                mask: linear-gradient(0deg, transparent 10%, #000);
                z-index: -1;
            }
            .${FeedClasses.details} {
                display: flex;
                flex-direction: column;
                gap: var(--space-xs);
            }
            .title {
                color: var(--white);
            }
            .description {
                color: var(--white);
                font-size: 14px;
                font-weight: 400;
                line-height: 1.2857142857142858;
                margin: 0;
            }
            .timestamp {
                color: var(--app-message-embed-secondary-text);
                font-size: 12px;
                font-weight: 400;
                margin: 0;
                text-transform: unset;
            }
        } 
    }

    .activityFeedV2 {
        .nowPlaying .emptyState {
            background-color: var(--background-mod-normal) !important;
            border-color: var(--border-normal) !important;
        }
    }

    .dockV2 {
        &:is(.emptyState) {
            background: var(--background-feedback-info);
            border: 1px solid var(--icon-feedback-info) !important;
            border-radius: var(--radius-sm);
            color: var(--text-feedback-info) !important;
            padding: 8px !important;
            margin-bottom: var(--space-lg);
        }
    }

    .feedCarouselV2 {
        .arrowContainer .contents {
            display: contents;
        }
    }

    .nowPlaying .emptyState {
        border: 1px solid;
        border-radius: 5px;
        box-sizing: border-box;
        margin-top: 20px;
        padding: 20px;
        width: 100%;
    }

    .theme-light .nowPlaying .emptyState {
        background-color: #fff;
        border-color: var(--interactive-background-hover);
    }

    .theme-dark .nowPlaying .emptyState {
        background-color: rgba(79, 84, 92, .3);
        border-color: var(--background-mod-strong);
    }

    .theme-light .quickLauncher .emptyState, .theme-light .blacklist.emptyState {
        border-color: rgba(220,221,222,.6);
        color: #b9bbbe;
    }

    .theme-dark .quickLauncher .emptyState, .theme-dark .blacklist.emptyState {
        border-color: rgba(47,49,54,.6);
        color: #72767d;
    }

    .theme-light .nowPlayingColumn .sectionDivider {
        border-color: var(--interactive-background-hover);
    }

    .theme-dark .nowPlayingColumn .sectionDivider {
        border-color: var(--background-mod-strong);
    }

    .theme-dark .voiceSectionIconWrapper {
        background-color: var(--primary-800);
    }

    .theme-light .voiceSectionIconWrapper {
        background: var(--primary-300);
    }

    .quickLauncher .emptyState {
        border-bottom: 1px solid;
        font-size: 14px;
        padding: 20px 0;
        justify-content: flex-start;
        align-items: center;
    }

    .blacklist.emptyState {
        border-bottom: 1px solid;
        font-size: 14px;
        margin-bottom: 20px;
        justify-content: flex-start;
    }

    .blackList .emptyState {
        position: relative;
        padding: 0;
        border-bottom: unset; 
        line-height: 1.60;
    }

    .blacklist .sectionDivider, .settingsDivider {
        display: flex;
        width: 100%;
        border-bottom: 2px solid;
        margin: 4px 0 4px 0;
        border-color: var(--background-mod-strong);
    }

    .blacklist .sectionDivider:last-child {
        display: none;
    }

    .overflowUserOverflow .wrapper {
        width: 30px !important;
        height: 30px !important;
    }
`);

function webpackify(css) {
    for (const key in styles) {
        let regex = new RegExp(`\\.${key}([\\s,.):>])`, 'g');
        css = styles[key]?.value ? css.replace(regex, `.${styles[key].value}$1`) : css.replace(regex, `.${styles[key]}$1`);
    }
    return css;
}