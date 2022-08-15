const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
            clearTimeout(timer);
        }, delay);
    };
};

const once = (func) => {
    return function(...args){
        if(func)return;
        func.apply(this,args);
    }
}

export { debounce,once }
