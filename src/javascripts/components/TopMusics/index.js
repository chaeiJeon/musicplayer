export default class TopMusics {
    constructor(){
        this.rootElement = TopMusics.createRootElement();
        this.musics = [];
        this.bindEvents();
    }
    static createRootElement(){
        const rootElement = document.createElement('article');
        rootElement.classList.add('contents-top5');

        return rootElement;
    }
    bindEvents(){
        this.rootElement.addEventListener("click",(event)=>{
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
        })
    }
    renderStopAll(){
        //모든 음악 재생 상태를 중단하는 ui 변경 처리
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        playingButtons.forEach(element=>{
            element.classList.replace('icon-pause', 'icon-play');
        });
    }
    requestPlay(target){
        //음악 재생을 App.js에 요청
        const controller = target.parentElement;
        const {index:musicIndex} = controller.dataset;
        const payload = {musics:this.musics, musicIndex};
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
        const payload = {musics:this.musics, musicIndex};
        this.emit('addPlayList', payload);

    }
    setMusics(musics = []){
        //음악의 배열을 받아와서 this.musics에 넣어주기
        this.musics = musics;
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
        const topRoof = `
            <div class="top5-roof">
                <img src="assets/images/Logo.png">
            </div>
        `;
        const musicList = this.musics.map((music, index)=>{
            const {cover, title, artists } = music;
            return `
                <li>
                <div class="music-rank">${index+1}</div>
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
            `
        }).join('');
        this.rootElement.innerHTML = topRoof + '<ol class="top5-list">' +
        musicList + '</ol';

        return this.rootElement;
    }
}