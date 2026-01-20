import { Common } from "@./modules/common";

export function CardBody({activities, user, voice, streams, v2Enabled}) {
    return;
}

createElement('div', { className: "cardBody_267ac" },
            createElement('div', { className: "section_267ac" },
                createElement('div', { className: "game_267ac" },
                    createElement('div', { className: `gameBody_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart}`, style: { flex: "1 1 auto" } }, [
                        //!streams.length ? createElement(VoiceCards, { activities: activities, voice: voice, streams: streams }) : createElement(StreamCards, { user: user, voice: voice, streams: streams }),
                        createElement(VoiceCards, { activities: activities, voice: voice, streams: streams }),
                        filterCheck.streaming ? createElement(TwitchCards, { user: user, activity: activities[0] }) : createElement(ActivityCards, { user: user, activities: activities, voice: voice, streams: streams, check: filterCheck, v2Enabled: v2Enabled })
                    ])
                )
            )
        )