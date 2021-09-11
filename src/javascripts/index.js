import App from './App.js';

const config ={
    el: '#app' //루트요소로 id가 app인거 사용, index.html에서 root로 app이라는 div를 만들어 줄 것이기 때문에
};

new App(config).setup();