export namespace Utils {

  export function includes(strOrArr: any, filters: any[]) {
    for (let i in filters) {
      if (strOrArr.includes(filters[i])) return true;
    }

    return false;
  }

  export function merge(results: any[]) {
    return results.reduce((previous, current) => [...previous, ...current], []);
  }

  export const selectFirstDocs = (docs) => docs.map(doc => doc.docs[0]);

}
