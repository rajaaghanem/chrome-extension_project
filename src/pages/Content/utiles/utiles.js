// create new url with isqa=true
export function createQAUrl(url) {
    const isQaParam = 'isqa=true';
    const querySymbol = url.indexOf('?') === -1 ? '?' : '&';
    const newUrl = url + querySymbol + isQaParam;
    return newUrl;
  }