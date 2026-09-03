
import { ContextMenu, Hooks, Utils, React } from 'betterdiscord';
import { Common, AvatarUtils } from "@modules/common";
import { FeedCarouselItemOverflow, FeedCarouselItemPopout } from "@application_news/components/FeedCarouselItemOverflow";
import settings from "@settings/settings";
import FeedClasses from "@application_news/ApplicationNews.module.css";
import NewsStore, { type Article as NewsItem } from "@activity_feed/GameNewsStore";

interface CarouselItem {
    article: NewsItem
    orientation: string,
    useGameProfile: any
}

function FeedCarouselItem(Article: any) {
    return function WrappedComponent(props: any) {
        let id = props.article.application.id;
        if (isNaN(id)) id = undefined; 
        const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: id});
        const orientation = Hooks.useStateFromStores(NewsStore, () => NewsStore.getOrientation());
        return <Article {...props} useGameProfile={useGameProfile} orientation={orientation} />
    }
}

class Article extends React.PureComponent<CarouselItem> {
    static displayName = "FeedCarouselItem";
    declare state;
    _animatedBackground = new Common.Animated.Value(0);
    _animatedText = new Common.Animated.Value(0);
    _zIndex = new Common.Animated.Value(1);
    constructor(props: any) {
        super(props);
        this.state = {
            getDirection: () => NewsStore.getDirection(),
        }
    }

    componentWillEnter(e: any) {
        let direction = this.state.getDirection();
        this._zIndex.setValue(direction === 1 ? 2 : 1),
        direction === 1 && (this._animatedBackground.setValue(-1), 
        Common.Animated.timing(this._animatedBackground, {
            toValue: 0,
            duration: 250,
            delay: 100
        }).start()),
        this._animatedText.setValue(-direction),
        Common.Animated.timing(this._animatedText, {
            toValue: 0,
            duration: 200,
            delay: 300
        }).start(e)
    }

    componentWillLeave(e: any) {
        let direction = this.state.getDirection();
        this._zIndex.setValue(direction === 1 ? 1 : 2),
        Common.Animated.timing(this._animatedText, {
            toValue: direction,
            duration: 200,
        }).start(),
        direction === 1 ? setTimeout(e, 350) : Common.Animated.timing(this._animatedBackground, {
            toValue: -1,
            delay: 200,
            duration: 200
        }).start(e)
    }

    getRootStyle() {
        let anim = this.props.orientation === "horizontal" ? {
            translateX: this._animatedBackground.interpolate({
                inputRange: [0, 1],
                outputRange: ["0px", "-15px"]
            })
        }:{
            translateY: this._animatedBackground.interpolate({
                inputRange: [0, 1],
                outputRange: ["0px", "15px"]
            })
        }
        return Common.Animated.accelerate({
            transform: [{ scale: this._animatedBackground.interpolate({ inputRange: [-1, 0, 1], outputRange: [1.015, 1, 1.015] }) }, anim],
            opacity: this._animatedBackground.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0], easing: Common.Animated.Easing.in(Common.Animated.Easing.ease) }),
            zIndex: this._zIndex
        })
    }

    getTextStyle() {
        let anim = this.props.orientation === "horizontal" ? {
            translateX: this._animatedText.interpolate({
                inputRange: [0, 1],
                outputRange: ["0px", "-15px"]
            })
        }:{
            translateY: this._animatedText.interpolate({
                inputRange: [0, 1],
                outputRange: ["0px", "15px"]
            })
        }
        return {
            transform: [anim],
            opacity: this._animatedText.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0], easing: Common.Animated.Easing.in(Common.Animated.Easing.ease) }),
            zIndex: 1,
            marginBottom: this.props.orientation === "horizontal" ? "40px" : "0px"
        }
    }

    handleRightClick(e: React.MouseEvent<HTMLElement>) {
        let currentArticle = this.props.article;

        return ContextMenu.open(e, (props) => <FeedCarouselItemPopout {...props} application={currentArticle.application} articleUrl={currentArticle.news?.url} /> )
    }

    renderBackground() {
        let currentArticle = this.props.article;
        const thumbnail = currentArticle.news?.thumbnail?.replace(/\s/g, "%20"); // fix for urls that have spaces in them thanks to lacking URI encoding
        
        return (
            <div className={FeedClasses.background}>
                <div 
                    className={Utils.className(FeedClasses.backgroundImage, !currentArticle.news?.thumbnail && FeedClasses.backgroundBackup)}
                    style={{backgroundImage: currentArticle.news?.thumbnail && `url(${thumbnail})`}}
                />
            </div>
        )
    }

    renderApplicationIcon() {
        let currentArticle = this.props.article;
        const External = settings.external[currentArticle.id];
        const useGameProfile = this.props.useGameProfile;

        return (
            isNaN(currentArticle.application?.id) ? <External.icon className={FeedClasses.gameIcon} color="WHITE" style={{ backgroundColor: External.color, padding: "5px", width: "30px", height: "30px" }} />
            : <img
                className={FeedClasses.gameIcon}
                onClick={useGameProfile}
                onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(FeedClasses.clickableIcon)}
                onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(FeedClasses.clickableIcon)}
                src={currentArticle.news?.application_id && currentArticle.application?.icon
                    ? AvatarUtils.getApplicationIconURL({id: currentArticle.news.application_id, icon: currentArticle.application?.icon, size: 64, keepAspectRatio: false})
                    : `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.news.application_id}/capsule_231x87.jpg`
                }
            />
        )
    }
    
    render() {
        if (!this) return;
        let currentArticle = this.props.article;
        const simple = this.props.orientation === "horizontal";
        
        return (
            <>
                <FeedCarouselItemOverflow application={currentArticle.application} articleUrl={currentArticle.news?.url} position="right" />
                <Common.Anchor
                    tabIndex={currentArticle.index}
                    href={currentArticle.news?.url || undefined}
                    target="_blank"
                >
                    <Common.Animated.div className={Utils.className(simple ? FeedClasses.articleSimple : FeedClasses.articleStandard, FeedClasses.article)} style={this.getRootStyle()} onContextMenu={(e: React.MouseEvent<HTMLElement>) => this.handleRightClick(e)}>
                        {this.renderBackground()}
                        <Common.Animated.div className={FeedClasses.detailsContainer} style={this.getTextStyle()}>
                            <div className={FeedClasses.applicationArea}>
                                {this.renderApplicationIcon()}
                                <div className={simple ? FeedClasses.titleRowSimple : FeedClasses.details}>
                                    <div className={`${FeedClasses.titleStandard} ${FeedClasses.title}`}>{currentArticle.news?.title || "No Title"}</div>
                                    {!simple && <>
                                        <div className={FeedClasses.description} dangerouslySetInnerHTML={{__html: currentArticle.news?.description || "No description available."}} />
                                        <div className={FeedClasses.timestamp}>{Common.intl.intl.data.formatDate(new Date(currentArticle.news?.timestamp), {dateStyle: "long"})}</div>
                                    </>}
                                </div>
                            </div>
                        </Common.Animated.div>
                    </Common.Animated.div>
                </Common.Anchor>
            </>
        )
    }
}
export default FeedCarouselItem(Article);