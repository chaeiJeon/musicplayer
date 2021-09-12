export default class PlayView {
    constructor(){
        this.audio = new Audio();
        this.rootElement = PlayView.createRenderElement();
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
            fromPauseToPlay.classList.remove('hide');
            this.emit('musicEnded', {repeat:this.repeat, random: this.random});
        });

        let intervaler = 0;
        this.audio.addEventListener('timeupdate', ()=>{
            //오디오가 얼마나 처리되었는지 진행상황
            intervaler++;
            if(intervaler %3 !== 0){
                return;
            }
            const audioProgress = this.audio.currentTime/this.audio.duration*100; //현재 진행률 계산
            const controlProgress = audioProgress>100?100 : audioProgress;
            const progressBarElement = this.rootElement.querySelector('.progress');
            progressBarElement.value = controlProgress ? controlProgress*10 : 0; //1씩 움직이면 끊어지는 느낌나서 10씩
        })
    }
    playMusic(payload){
        this.pause();
        console.log(payload);
        if(payload){
            const {musics, musicIndex} = payload;
            this.audio.src = musics[musicIndex].source;
            this.playViewMusic = musics[musicIndex];
            this.renderMusicContainer();
        }
        this.audio.play();
    }
    pause(){
        this.audio.pause();
    }
    renderMusicContainer(){
        const {artists, cover, title} = this.playViewMusic;
        this.rootElement.innerHtml = `
            <div class="play-view-container">
                <h2 class="invisible-text">Play View</h2>
                <button class="back-button">
                    <i class="icon-controller-back"></i>
                </button>
                <div class="cover-wrapper">
                    <img src="https://localhost:3000${cover}"/>
                    <span class="music-artist-name">${artists.join(', ')}</span>
                <div>
                <div class="play-view-controller">
                    <div class="controller-container">
                        <button class="controller-button control-repeat ${this.repeat?'on':''}">
                            <i class="icon-controller-repeat"></i.
                        </button>
                        <button class="control-button control-backward">
                            <i class="icon-controller-backward"></i>
                        </button>
                        <button class="control-button control-play hide">
                            <i class="icon-controller-play"></i>
                        </button>
                        <button> class="control-button control-pause">
                            <i class="icon-controller-pause"></i>
                        </button>
                        <button class="control-button control-forward">
                            <i class="icon-controller-forward"></i>
                        </button>
                        <button class="control-button control-rotate" ${this.random?'on':''}>
                            <i class="icon-controller-rotate"></i>
                        </button>
                    </div>
                    <div class="progress-container">
                        <input class="progress" type="range" min="0" max="1000" value="0">
                        <div class="progress-time">
                            <div class="current-time">1:43</div>
                            <div class="end-time">3:16</div>
                        </div>
                    </div
                </div>
        `;
        const backButton = this.rootElement.querySelector('.back-button');
        const playButton = this.rootElement.querySelector('.control-play');
        const pauseButton = this.rootElement.querySelector('.control-pause');
        const backward = this.rootElement.querySelector('.control-forward');
        const forward = this.rootElement.querySelector('.control-forward');
        const repeat = this.rootElement.querySelector('.control-repeat');
        const random = this.rootElement.querySelector('.control-rotate');
        const progress = this.rootElement.querySelector('.progress');

        playButton.addEventListener('click', ()=>{
            this.playMusic();
            playButtton.classList.add('hide');
            pauseButton.classList.remove('hide');
        });
        pauseButton.addEventListener('click',()=>{
            this.pause();
            playButton.classList.remove('hide');
            pauseButton.classList.add('hide');
        });
        repeat.addEventListener('click',()=>{
            this.repeat = !this.repeat;
            if(this.repeat){
                repeat.classList.add('on');
            }else{
                repeat.classList.remove('on');
            }
        });
        random.addEventListener('click',()=>{
            this.random = !this.random;
            if(this.repeat){
                random.classList.add('on');
            }else{
                random.classList.remove('on');
            }
        });
        backButton.addEventListener('click',()=>{
            this.hide()
        });
        backward.addEventListener('click',()=>{
            this.emit('backward');
        });
        forward.addEventListener('click',()=>{
            this.emit('forward');
        });
        progress.addEventListener('change',(event)=>{
            const targetTime = this.audio.duration*Number(event.target.value)/1000;
            this.audio.currentTime = targetTime;
        })
    }
    show(){
        document.body.append(this.rootElement);
    }
    hide(){
        document.body.removeChild(this.rootElement);
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