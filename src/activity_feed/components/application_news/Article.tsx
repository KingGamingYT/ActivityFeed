
import { Hooks, Utils, React } from 'betterdiscord';
import { Common } from "@modules/common";
import { FeedOverflowBuilder } from "@application_news/components/OverflowBuilder";
import settings from "@settings/settings";
import FeedClasses from "@application_news/ApplicationNews.module.css";
import NewsStore from "@activity_feed/Store";

export function FeedArticle(Article) {
    return function WrappedComponent(props) {
        const useGameProfile = Common.GameProfileCheck({trackEntryPointImpression: false, applicationId: props.article.application.id});
        const orientation = Hooks.useStateFromStores(NewsStore, () => NewsStore.getOrientation());
        return <Article {...props} useGameProfile={useGameProfile} orientation={orientation} />
    }
}

class Article extends React.PureComponent {
    static displayName = "FeedArticle";
    state;
    _animatedBackground = new Common.Animated.Value(0);
    _animatedText = new Common.Animated.Value(0);
    _zIndex = new Common.Animated.Value(1);
    constructor(article) {
        super(article);
        this.state = {
            getDirection: () => NewsStore.getDirection(),
        }
    }

    componentWillEnter(e) {
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

    componentWillLeave(e) {
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

    renderBackground() {
        let currentArticle = this.props.article;
        
        return (
            <div className={FeedClasses.background}>
                <div 
                    className={FeedClasses.backgroundImage}
                    style={{ 
                        backgroundImage: currentArticle.news?.thumbnail ? `url(${currentArticle.news?.thumbnail})`
                        : `url(https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${currentArticle.id}/capsule_616x353.jpg)`
                    }}
                />
            </div>
        )
    }

    renderApplicationIcon() {
        let currentArticle = this.props.article;
        const External = settings.external[currentArticle.id];
        const useGameProfile = this.props.useGameProfile;

        return (
            isNaN(currentArticle.news?.application_id) ? <External.icon className={FeedClasses.gameIcon} color="WHITE" style={{ backgroundColor: External.color, padding: "5px", width: "30px", height: "30px" }} />
            : <img
                className={FeedClasses.gameIcon}
                onClick={useGameProfile}
                onMouseOver={(e) => Boolean(useGameProfile) && e.currentTarget.classList.add(`${FeedClasses.clickableIcon}`)}
                onMouseLeave={(e) => Boolean(useGameProfile) && e.currentTarget.classList.remove(`${FeedClasses.clickableIcon}`)}
                src={currentArticle.news?.application_id && currentArticle.application?.icon
                    ? `https://cdn.discordapp.com/app-icons/${currentArticle.news.application_id}/${currentArticle.application?.icon}.webp?size=64&keep_aspect_ratio=false`
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
                <FeedOverflowBuilder applicationId={currentArticle.application.id} gameId={currentArticle.id} articleUrl={currentArticle.news?.url} position="right" />
                <a
                    tabindex={currentArticle.index}
                    className={`${Common.AnchorClasses.anchor} ${Common.AnchorClasses.anchorUnderlineOnHover}`}
                    href={currentArticle.news?.url || "#"}
                    rel="noreferrer nopener"
                    target="_blank"
                    role="button"
                >
                    <Common.Animated.div className={Utils.className(simple ? FeedClasses.articleSimple : FeedClasses.articleStandard, FeedClasses.article)} style={this.getRootStyle()}>
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
                </a>
            </>
        )
    }
}
export default FeedArticle(Article);