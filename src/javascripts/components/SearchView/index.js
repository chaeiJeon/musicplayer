import { removeAllChildNodes } from '../../utils/index.js';
export default class SearchView {
    constructor(){
        this.rootElement=SearchView.createRootElement();
        this.searchedMusics = []; //검색한 결과를 담는 배열
        this.bindEvents();
    }
    static createRootElement(){
        const rootElement = document.createElement('article');
        rootElement.classList.add('contents-search');
        rootElement.innerHTML =`
            <div class="search-controller">
                <input class="search-input" type="text" placeholder="검색"/>
                <button class="saerch-button">
                    <i class="icon-search-controller"></i>
                </button>
            </div>
            <ul class="music-list"></ul>
        `;

        return rootElement;
    }
    bindEvents(){
        this.rootElement.querySelector('.search-input').addEventListener('input',(event)=>{
            const query = event.target.value;
            this.emit('searchMusic',query); //App.js로 전달할 data
        });
        this.rootElement.addEventListener('click',(event)=>{
            const {target} = event;
            const isControllerButton = target.tagName === "BUTTON";

            if(!isControllerButton){
                return;
            }
            //버튼 태그의 1번 인덱스
            const buttonRole = target.classList.item(1);
            switch (buttonRole){
                case `icon-play`:{
                    this.requestPlay(target);
                    break;
                }
                case 'icon-pause':{
                    this.requestPause(target);
                    break;
                }
                case 'icon-plus':{
                    this.requestAddPlayList(target);
                    break;
                }
            }
        });
    }
    renderStopAll(){
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        playingButtons.forEach(element=>{
            element.classList.replace('icon-pause', 'icon-play');
        });
    }
    requestPlay(target){
        //음악 재생을 App.js에 요청
        const controller = target.parentElement;
        const {index:musicIndex} = controller.dataset;
        const payload = {musics:this.searchedMusics, musicIndex};
        this.emit('play', payload);
        this.renderStopAll();
        target.classList.replace('icon-play','icon-pause');
    }
    requestPause(target){
        //음악 중단을 App.js에 요청
        this.emit('pause'); //App.js 에 전달
        target.classList.replace('icon-pause','icon-play');
    }
    requestAddPlayList(target){
        //플레이리스트에 추가를 요청, +버튼 누르면 추가되기
        const controller = target.parentElement;
        const {index:musicIndex} = controller.dataset;
        const payload = {musics:this.searchedMusics, musicIndex};
        this.emit('addPlayList', payload);
    }
    setSearchResult(musicList = []){
        this.searchedMusics = musicList;
        this.renderSearchMusics();
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

    renderSearchMusics(){
        const musicListElement = this.rootElement.querySelector('.music-list');
        removeAllChildNodes(musicListElement);
        const searchedMusics = this.searchedMusics.map((music, index)=>{
            const {cover,title,artists} = music;
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
                        <div class="music-simple-controller" data-index=${index}>
                            <button class="icon icon-play">
                                <span class="invisible-text">재생</span>
                            </button>
                            <button class="icon icon-plus">
                                <span class="invisible-text">추가</span>
                            </button>
                        </div>
                    </div>
                </li>
            `;
        }).join('');
        musicListElement.innerHTML=searchedMusics;
    }
    render(){
        return this.rootElement;
    }
}