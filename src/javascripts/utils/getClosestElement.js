// 부모 엘리먼트로 올라가면서 셀렉터를 만족하는 가장 가까운 요소를 찾는다
const getClosestElement = (element, selector)=>{
    let evaluate = false;
    if(/^\./.test(selector)){
        //앞에 .이 붙어있는가=>그럼 클래스 선택자
        evaluate = element.classList.contains(selector);
    }else{
        console.log(element.tagName);
        console.log(selector.toUpperCase());
        //클래스 선택자가 주어진게 아니다 => 태그 선택자
        evaluate = element.tagName === selector.toUpperCase();
    }

    if(evaluate){
        return element;
    }
    return getClosestElement(element.parseElement, selector);
}

export default getClosestElement;