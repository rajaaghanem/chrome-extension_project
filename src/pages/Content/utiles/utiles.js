// create new url with isqa=true
export function createQAUrl(address) {
  const url = new URL(address);
  url.searchParams.append("isqa","true");
  return url.toString();
  }