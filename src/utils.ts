export namespace Utils {

    export function includes(strOrArr: any, filters: any[]) {
        for (let i in filters) {
            if (strOrArr.includes(filters[i])) return true;
        }

        return false;
    }

}
