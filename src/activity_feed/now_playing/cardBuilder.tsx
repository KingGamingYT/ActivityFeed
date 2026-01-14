export function NowPlayingCardBuilder({card, v2Enabled}) {


    return (
        <div className={v2Enabled ? "_2cbe2fbfe32e4150-cardV2" : "_2cbe2fbfe32e4150-card"} style=={{ background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})`}}>
            <CardHeader />
            <CardBody />
        </div>
    )
}

function notNowPlayingCardBuilder({card, v2Enabled}) {
    const [showPopout, setShowPopout] = useState(false);
    const refDOM = useRef(null);

    const user = card.party.priorityMembers[0].user;
    const status = card.party.priorityMembers[0].status;
    const activities = card.party.currentActivities;
    const currentGame = card.party.currentActivities[0]?.game
    const voice = card.party.voiceChannels;
    const streams = card.party.applicationStreams;
    const isSpotify = card.party.isSpotifyActivity;
    const filterCheck = activityCheck({activities: activities, spotify: isSpotify});
    const cardGrad = GradGen(filterCheck, isSpotify, activities[0]?.activity, currentGame, voice, streams[0]?.stream);

    useEffect(() => { 
        (async () => {
            await FetchGames.getDetectableGamesSupplemental([currentGame?.id]);
        })()
    }, [currentGame?.id]);
    
    const game = DetectableGameSupplementalStore.getGame(currentGame?.id) || (ApplicationStore.getApplication(currentGame?.id) && DetectableGameSupplementalStore?.getGame(GameStore.getGameByApplication(ApplicationStore.getApplication(currentGame?.id))?.id));
    const splash = SplashGen(isSpotify, activities[0]?.activity, {currentGame: currentGame, data: game}, voice, streams[0]?.stream);
    //console.log(activities);

    return createElement('div', { className: v2Enabled ? "cardV2_267ac" : "card_267ac", style: { background: v2Enabled && `linear-gradient(45deg, ${cardGrad.primaryColor}, ${cardGrad.secondaryColor})`} }, [
        createElement('div', { className: `cardHeader_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyStart} ${positionClasses.alignCenter}`, style: { flex: "1 1 auto" } }, [
            voice && activities.length === 0 ? 
            createElement('div', { className: "server_267ac splashArt_267ac", style: { backgroundImage: `url(${splash})` } }) 
            : createElement('div', { className: "splashArt_267ac", style: { backgroundImage: `url(${splash})` } }),
            createElement('div', { className: "header_267ac"}, [ 
                createElement(AvatarFetch, { imageClassName: "avatar", src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=48`, status: status, size: "SIZE_40" }),
                createElement('div', { className: "nameTag_267ac", style: { flex: 1 } },
                    createElement('span', {className: "username", onClick: () => ModalAccessUtils.openUserProfileModal({ userId: user.id }) },
                    voice[0]?.members.length > 2 
                    ? `${user.globalName}, ${intl.intl.formatToPlainString(intl.t['zRRd8G'], { count: voice[0]?.members.length - 2, name: (voice[0]?.members[voice[0]?.members.length - 1].globalName ||  voice[0]?.members[voice[0]?.members.length - 1].username) })}`
                    : voice[0]?.members.length > 1 
                        ? intl.intl.formatToPlainString(intl.t['4SM/RX'], { user1: (user.globalName || voice[0]?.members[1].username), user2: (voice[0]?.members[1].globalName || voice[0]?.members[1].username) })
                        : (user.globalName || user.username)
                    )
                ),
                createElement('div', { 
                    className: `headerActions_267ac ${positionClasses.flex} ${positionClasses.noWrap} ${positionClasses.justifyEnd} ${positionClasses.alignCenter}`, 
                    style: { flex: "0" }}, [
                    createElement('button', { 
                        type: "button", 
                        className: `button_267ac ${buttonClasses.lookFilled} ${buttonClasses.sizeSmall}`, 
                        onClick: () => OpenDM.openPrivateChannel({recipientIds: user.id})
                    }, "Message"),
                    createElement('div', {}, 
                        createElement(Popout, { 
                            targetElementRef: refDOM,
                            clickTrap: true,
                            onRequestClose: () => setShowPopout(false),
                            renderPopout: () => createElement(PopoutContainer, { position: "left" }, 
                                createElement(CardPopout, { party: card.party, close: () => setShowPopout(false) })),
                            position: "left",
                            shouldShow: showPopout
                        }, (props) => createElement('div', 
                            { 
                                ...props,
                                ref: refDOM,
                                onClick: () => setShowPopout(true)
                            },
                            createElement('button', {
                                type: "button",
                                className: `button_267ac ${buttonClasses.lookBlank} ${buttonClasses.grow}`,
                            }, createElement('svg', { 
                                width: 24, 
                                height: 24, 
                                viewBox: "0 0 24 24",
                                className: "overflowMenu_267ac" },
                                createElement('g', { fill: "none", fillRule: "evenodd"}, [
                                    createElement('path', { d: "M24 0v24H0V0z" }),
                                    createElement('path', { 
                                        fill: "currentColor", 
                                        fillRule: "evenodd", 
                                        d: "M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z" }
                                    )
                                ])
                            ))
                        ))
                    )
                ]),
                isSpotify ? createElement('svg', { 
                    className: "headerIcon_267ac", 
                    "aria-hidden": true, 
                    role: "image",
                    width: 16, 
                    height: 16, 
                    viewBox: "0 0 16 16" },
                    createElement('g', { fill: "none", fillRule: "evenodd"}, [
                        createElement('path', { 
                            fill: "var(--spotify)",
                            d: "M12.7609503,7.08043507 C10.1796226,5.54647845 5.92178025,5.40543597 3.45759439,6.15380317 C3.06179846,6.27398591 2.64333918,6.05046133 2.5234242,5.65450895 C2.40350922,5.25826952 2.62670026,4.83983073 3.02268744,4.71945662 C5.85139953,3.86028398 10.5538071,4.02620506 13.52548,5.79134121 C13.8813999,6.00280925 13.9981592,6.46277616 13.7872083,6.81834866 C13.5760661,7.17449528 13.1160095,7.2919031 12.7609503,7.08043507 Z M12.7456938,9.37785148 C12.5639139,9.67256952 12.1782795,9.76502256 11.883727,9.58404861 C9.72377106,8.25738585 6.4301382,7.87299604 3.87475822,8.64810544 C3.54335063,8.74813503 3.19341953,8.56150265 3.09273996,8.2309159 C2.99292418,7.89984962 3.17979084,7.55075308 3.51062257,7.45005215 C6.42975429,6.56484307 10.0587298,6.99354129 12.5395359,8.51700243 C12.8340884,8.69826409 12.9268019,9.08380478 12.7456938,9.37785148 Z M11.7108365,11.5428368 C11.566471,11.780912 11.2582675,11.8554793 11.0223905,11.7103962 C9.13604653,10.5509855 6.76173752,10.28918 3.96555508,10.9314428 C3.69610478,10.9935661 3.42751778,10.823788 3.36603055,10.5528184 C3.30435146,10.2819451 3.47260203,10.0118436 3.74262788,9.95000969 C6.80260111,9.2465882 9.42736749,9.54929481 11.5446963,10.8504123 C11.7807651,10.995399 11.8551061,11.3055334 11.7108365,11.5428368 Z M0,7.99990447 C0,12.4185663 3.58181579,16 8,16 C12.4183753,16 16,12.4185663 16,7.99990447 C16,3.58172026 12.4183753,0 8,0 C3.58181579,0 0,3.58172026 0,7.99990447 Z"
                        }),
                        createElement('rect', { width: 16, height: 16 })
                    ])
                )
                : activities.length !== 0 && createElement('img', { 
                    className: "headerIcon_267ac", 
                    alt: "",
                    src: `https://cdn.discordapp.com/app-icons/${currentGame?.id}/${currentGame?.icon}.png?size=64&keep_aspect_ratio=false` 
                })
            ])
        ]),
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
    ])
}