import { findIndexListElement, getClosestElement } from "../../utils/index.js";

export default class PlayList {
    constructor(){
        this.rootElement = PlayList.createRootelement();
        this.musicList = [];
        this.loadStorage();
        this.bindEvents();
    }
    static createRootelement(){
        const rootElement = document.createElement('article');
        rootElement.classList.add('contents-playlist');

        return rootElement;
    }
    bindEvents(){
        this.rootElement.addEventListener("click",(event)=>{
            const {target} = event;
            const isControllerButton = target.tagName ==='BUTTON';
            //button은 마이너스 버튼 뿐이니까 그게 눌리면 removeMusicItem
            if(!isControllerButton){
                //아니면 음악 재생
                return this.playMusicItem(target);
            }
            this.removeMusicItem(target);
            
        })
    }
    playNext(payload){
        let currentIndex = this.musicList.findIndex(music=>music.playing);
        const isMusicIndexEnd = currentIndex >= this.musicList.length-1;
        if(isMusicIndexEnd){
            currentIndex = -1;
        }
        if(payload){
            const {repeat, random} = payload;
            console.log("repeat , random : ",repeat, random);
            if(!random && !repeat && isMusicIndexEnd){
                return;
            }
            if(random){
                currentIndex = Math.floor(Math.random() * (this.musicList.length-2));
            }
        }
        const nextIndex = currentIndex+1;
        this.playMusicItem(nextIndex);
    }
    playPrev(){
        console.log("playPrev");
        let currentIndex = this.musicList.findIndex(music=>music.playing);
        if(currentIndex <=0 ){
            currentIndex = this.musicList.length;

        }
        const prevIndex =currentIndex-1;
        this.playMusicItem(prevIndex);

    }
    playMusicItem(target){
        const listItemElement = typeof target ==='number' ? this.rootElement.
        querySelectorAll('li')[target] : getClosestElement(target,'LI');

        const musicIndex = findIndexListElement(listItemElement);
        const requestPlay = this.musicList[musicIndex].playing; //현재 재생중인 음악인지 파악
        this.musicList.forEach(musicInfo =>{
            musicInfo.playing = false;
        });
        this.rootElement.querySelectorAll('li').forEach(element=>element.
        classList.remove('on'));
        if (!requestPlay){
            listItemElement.classList.add('on');
            this.musicList[musicIndex].playing = true;
            console.log("requestplay");
            this.emit('play', {musics: this.musicList, musicIndex});
        }else{
            listItemElement.classList.add('on');
        }
    }
    removeMusicItem(target){
        const listItemElement = getClosestElement(target, 'LI');
        const musicIndex = findIndexListElement(listItemElement);
        this.remove(Number(musicIndex));
        listItemElement.parentElement.removeChild(listItemElement);

    }
    add(music){
        this.musicList.push(music);
        this.saveStorage();
    }
    remove(index){
        this.musicList.splice(index,1);
        this.saveStorage();
    }
    loadStorage(){
        //저장소에 임시로 저장한 음악리스트를 호출하는 함수
        const stringifiedPlaylist = localStorage.getItem('playlist');
        try{
            const playList = JSON.parse(stringifiedPlaylist);
            // Array의 instance냐? 그렇다면 playList를 반환하고 아니면 빈배열 반환
            this.musicList = playList instanceof Array ? playList : [];
        }catch(e){
            console.error(e);
        }
    }
    saveStorage(){
        //음악을 다시 호출할 수 있도록 localstorage에서 호출하는 함수
        const musicList = this.musicList.map(
            ({artists,cover,source,title}) => ({artists,cover,source,title})
        );
        try{
            localStorage.setItem('playlist', JSON.stringify(musicList));
        }catch(e){
            console.error(e);
        }
    }
    on(eventName, callback){
        //부모로부터 요청을 받음
        this.events = this.events? this.events : {};
        this.events[eventName] =callback;
    }
    emit(eventName, payload){
        //부모로 데이터 전달
        this.events[eventName] && this.events[eventName](payload);
    }
    render(){
        const playListTitle = '<h2 class="playlist-title">MY PLAYLIST</h2>';
        const musicList = this.musicList.map((music,index)=>{
            const {cover, title, artists} = music;
            return `
                <li>
                    <div class="music-content">
                        <div class="music-data">
                            <div class="music-cover">
                                <img src="${cover}"/>
                            </div>
                            <div class="music-info">
                                <strong class="music-title">${title}</strong>
                                <em class="music-artist">${artists[0]}</em>
                            </div>
                        </div>
                        <div class="music-simple-controller">
                            <button class="icon icon-minus">
                                <span class="invisible-text">제거</span>
                            </button>
                        </div>
                    </div>
                </li>
            `
        }).join('');
        this.rootElement.innerHTML = playListTitle + '<ul class="music-list">'
        + musicList + '</ul>';
        return this.rootElement;
    }
}