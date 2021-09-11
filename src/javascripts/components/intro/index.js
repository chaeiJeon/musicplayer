export default class Intro{
    constructor(){
        this.parentElement = document.querySelector('body');
        this.renderElement = Intro.createRenderElement();
    }
    static createRenderElement(){
        //static은 정적 메소드로 클래스의 인스턴스 없이 호출됨. 클래스가 인스턴스화되면 호출할 수 없음
        const introContainer = document.createElement("div");
        introContainer.classList.add('intro');
        const introImage = document.createElement("img");
        introImage.src = 'assets/images/Logo.png';

        introContainer.append(introImage);
        return introContainer;
    }
    show(){
        this.parentElement.append(this.renderElement);
    }
    hide(){
        this.renderElement.style.opacity=0;
        setTimeout(()=>{
            this.parentElement.removeChild(this.renderElement);
        },1000);
    }
}