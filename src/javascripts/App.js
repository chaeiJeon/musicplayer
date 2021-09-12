import { Intro, TabButtons, TopMusics, SearchView, PlayList } from './components/index.js';
import { fetchMusics } from '../APIs/index.js';
import removeAllChildNodes from './utils/removeAllChildNodes.js';

export default class App {
    constructor(props) {
        this.props = props;
        this.currentMainIndex = 0;
        this.mainViewComponents = [];
    }
    async setup() {
        //awake를 사용할것이기 때문에 async
        const { el } = this.props;
        this.rootElement = document.querySelector(el);

        this.intro = new Intro();
        this.tabButtons = new TabButtons();
        this.topMusics = new TopMusics();
        this.searchView = new SearchView();
        this.playList = new PlayList();

        this.mainViewComponents = [this.topMusics, this.playList, this.searchView];
        this.bindEvents();
        //음악 가져오기
        await this.fetchMusics(); //여기서 서버와 통신해서 데이터 받아옴
        this.init();
    }
    bindEvents() {
        //탭버튼 컴포넌트 이벤트
        this.tabButtons.on("clickTab", (payload) => {
            const { currentIndex = 0 } = payload;
            this.currentMainIndex = currentIndex;
            this.render();
        });
        //탑뮤직 컴포넌트 이벤트
        this.topMusics.on('play', (payload) => {
            // this.playView.playMusic(payload);
        });
        this.topMusics.on('pause', () => {
            // this.playView.pause()
        });
        this.topMusics.on('addPlayList', (payload) => {
            const { musics, musicIndex } = payload;
            this.playList.add(musics[musicIndex]);
        });
        //플레이 리스트에서 음악요청이 오면 플레이뷰에게 음악 플레이 요청
        this.playList.on('play',(payload)=>{
            // this.playView.playMusic(payload);
            // this.playView.show();
        });
        //플레이 리스트에서 음악요청이 오면 플레이뷰에게 음악 플레이 멈춤
        this.playList.on('pause', ()=>{
            // this.playView.pause();
        });
        this.searchView.on('searchMusic', (query) => {
            if (!query) {
                return this.searchView.setSearchResult([]);
            }
            const searchedMusics = this.topMusics.musics.filter(music => {
                const { artists, title } = music;
                const upperCaseQuery = query.toUpperCase();
                //아티스트 찾기
                const filteringName = artists.some(artist => artist.toUpperCase().includes(upperCaseQuery));
                //제목 찾기
                const filteringTitle = title.toUpperCase().includes(upperCaseQuery);
                return filteringName || filteringTitle;
            });

            //찾은 결과를 검색뷰에 반환
            this.searchView.setSearchResult(searchedMusics);
        });
        this.searchView.on('play', (payload) => {
            // this.playView.playMusic(payload);
        });
        this.searchView.on('pause', () => {
            // this.playView.pause()
        });
        this.searchView.on('addPlayList', (payload) => {
            const { musics, musicIndex } = payload;
            this.playList.add(musics[musicIndex]);
        });
    }
    async fetchMusics() {
        const responsebody = await fetchMusics();
        const { musics = [] } = responsebody;
        this.topMusics.setMusics(musics);
    }
    init() {
        this.intro.show();
        setTimeout(() => {
            this.render();
            this.intro.hide();
        }, 2000);
    }

    renderMainView() {
        const renderComponent = this.mainViewComponents[this.currentMainIndex];
        return renderComponent ? renderComponent.render() : '';
    }
    render() {
        removeAllChildNodes(this.rootElement);
        const tabButtons = this.tabButtons.render();
        const mainView = this.renderMainView();
        this.rootElement.append(tabButtons);
        this.rootElement.append(mainView);
    }
}