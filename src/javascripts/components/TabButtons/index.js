import { findIndexListElement, getClosestElement } from "../../utils/index.js";

export default class TabButtons{
    //navigation
    constructor(){
        this.renderElement = TabButtons.createRenderElement();
        this.bindEvents();
    }
    static createRenderElement(){
        const tabsContainer = document.createElement('UL');
        tabsContainer.classList.add('app-controller');
        const tabs=[
            { title: 'Top5', iconName:'icon-top5'},
            { title: 'PlayList', iconName:'icon-playlist'},
            { title: 'Search', iconName:'icon-search'}
        ];
        tabsContainer.innerHTML = tabs.map(tab=>{
            return ` 
                <li>
                    <button class="button-app-contrller">
                        <i class="tab-icon ${tab.iconName}"></i>
                        ${tab.title}
                    </button>
                </li>
            `;
        }).join(''); //반환된 요소를 연결해서 하나의 문자열로 반환하게 됨
        return tabsContainer;
    }
    bindEvents(){
        this.renderElement.addEventListener("click",(event)=>{
            const element = getClosestElement(event.target, "li");
            const currentIndex =findIndexListElement(element);

            this.emit('clickTab',{currentIndex});
        });
    }
    on(eventName, callback){
        this.events = this.events? this.events : {};
        this.events[eventName] =callback;
    }
    emit(eventName, payload){
        this.events[eventName] && this.events[eventName](payload);
    }
    render(){
        return this.renderElement;
    }
}