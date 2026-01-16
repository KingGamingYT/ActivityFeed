import { Webpack } from "betterdiscord";
import NowPlayingClasses from "./now_playing/NowPlaying.module.css";
import QuickLauncherClasses from "./quick_launcher/QuickLauncher.module.css";

const styles = Object.assign({
        wrapper: Webpack.getByKeys('wrapper', 'svg', 'mask').wrapper,
        customButtons: Webpack.getByKeys('customButtons', 'absolute').customButtons,
        hasText: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).hasText,
        sm: Webpack.getModule(x=>x.primary && x.hasText && !x.hasTrailing).sm,
        interactiveSelected: Webpack.getByKeys('icon', 'upperContainer').interactiveSelected
    },
    Webpack.getByKeys('itemCard'),
    Webpack.getByKeys('tabularNumbers'),
    Webpack.getByKeys('colorPrimary', 'grow'),
    Webpack.getByKeys('bar', 'container', 'progress'),
    Webpack.getModule(x=>x.buttonContainer && Object.keys(x).length === 1),
    NowPlayingClasses,
    QuickLauncherClasses
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

    .cardV2 {
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
    return css;
}