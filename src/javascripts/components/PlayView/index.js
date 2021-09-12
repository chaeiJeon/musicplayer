export default class PlayView {
    constructor(){
        this.audio = new Audio();
        this.rootElement = playView.createRenderElement();
        this.playViewMusic = null;
        this.repeat = false;
        this.random = false;
        this.bindEvents();
    }
    static createRenderElement(){
        const playViewWrapper = document.createElement('article');
        playViewWrapper.classList.add('play-View');
        return playViewWrapper;
    }
    bindEvents(){
        this.audio.addEventListener('ended', ()=>{
            const fromPauseToPlay = this.rootElement.querySelector('.control-play');
            const fromPlayToPause = this.rootElement.querySelector('.control-pause');
            fromPlayToPause.classList.add('hide');
            fromPauseToPlay.classList.add('hide');
            this.emit('musicEnded', {repeat:this.repeat, random: this.random});
        });

        let intervaler = 0;
    }
    playMusic(){

    }
    pause(){

    }
    show(){
        
    }
    hide(){
        
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
}