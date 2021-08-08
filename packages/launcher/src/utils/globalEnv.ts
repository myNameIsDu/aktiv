// When the formula is complete, go through the webpack configuration uniformly, and remove this method

const globalRouterBasePath = {
    get(): string {
        /* eslint-disable */
        //@ts-ignore 
        return window.__AKTIV_LAUNHCER__BASE_PATH;
        /* eslint-ENABLE */
    },
    set(s:string) :void{
        /* eslint-disable */
        //@ts-ignore 
        window.__AKTIV_LAUNHCER__BASE_PATH = s;
        /* eslint-ENABLE */
    }
};


export { globalRouterBasePath }