import _ from "lodash";

export default (stateRss, updatedRss) => {
  let feedIndex;
  const [ equalRss ] = stateRss.filter(({url}, i) => {
    if (url === updatedRss.url) {
      feedIndex = i;
    }
    return url === updatedRss.url
  });
  
  const simplifiedEqualRss = equalRss.posts.map((item) => item.link);
  const simplifiedUpdatedRss = updatedRss.posts.map((item) => item.link);
  const plainDifference = _.difference(simplifiedUpdatedRss, simplifiedEqualRss)

  if (plainDifference.length === 0) {

    return;
  }

  const diff = updatedRss.posts.reduce((acc, current) => {
    for (const link of plainDifference) {
      if (current.link === link) {
        acc.push(current);
        return acc;
      }
    }
    return acc;
  }, []);
  stateRss[feedIndex].posts.unshift(...diff);
}