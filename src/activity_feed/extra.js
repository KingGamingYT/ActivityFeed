import { Webpack } from "betterdiscord";
import MainClasses from "./ActivityFeed.module.css";
import NowPlayingClasses from "./components/now_playing/NowPlaying.module.css";
import QuickLauncherClasses from "./components/quick_launcher/QuickLauncher.module.css";

const styles = Object.assign({
        wrapper: Webpack.getByKeys('wrapper', 'svg', 'mask').wrapper,
        customButtons: Webpack.getByKeys('customButtons', 'absolute').customButtons,
        hasText: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).hasText,
        sm: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).sm,
        interactiveSelected: Webpack.getByKeys('icon', 'upperContainer').interactiveSelected,
        lookFilled: Webpack.getByKeys('colorPrimary', 'grow').lookFilled,
        colorPrimary: Webpack.getByKeys('colorPrimary', 'grow').colorPrimary
    },
    Webpack.getByKeys('itemCard'),
    Webpack.getByKeys('tabularNumbers'),
    Webpack.getByKeys('bar', 'container', 'progress'),
    Webpack.getModule(x=>x.buttonContainer && Object.keys(x).length === 1),
    MainClasses,
    NowPlayingClasses,
    QuickLauncherClasses
);

export const extraCSS = webpackify(`
    ._2cbe2fbfe32e4150-description .sharedFilePreviewYouTubeVideo {
        display: none;
    }

    .nowPlayingColumn .tabularNumbers {
        color: var(--text-default) !important;
    }

    .nowPlayingColumn :is(.actionsActivity, .customButtons) {
        gap: 8px;
    }

    .nowPlayingColumn .header > .wrapper {
        display: flex;
        cursor: pointer;
        margin-right: 20px;
        transition: opacity .2s ease;
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

    .quickLauncher .emptyState, .blacklist.emptyState {
        border-bottom: 1px solid;
        font-size: 14px;
        padding: 20px 0;
        justify-content: flex-start;
        align-items: center;
    }
`);

function webpackify(css) {
    for (const key in styles) {
        let regex = new RegExp(`\\.${key}([\\s,.):>])`, 'g');
        css = css.replace(regex, `.${styles[key]}$1`);
    }
    console.log(css)
    return css;
}