const findIndexListElement = (element) => {
    const listItems = element.parentElement.querySelectorAll('li');
    const currentIndex = Array.prototype.slice.call(listItems).findIndex(
        //배열에 있는 slice함수를 사용하기 위해서 call 사용
        listItem => listItem === element
    );
    return currentIndex;
}
export default findIndexListElement;
