import matchRoutes from 'react-router-config/matchRoutes';
import { endGlobalLoad } from '../store';

/**
 * Tells us if input looks like promise or not
 * @param  {Mixed} obj
 * @return {Boolean}
 */
export function isPromise(obj) {
  return typeof obj === 'object' && obj && obj.then instanceof Function;
}

/**
 * Utility to be able to iterate over array of promises in an async fashion
 * @param  {Array} iterable
 * @param  {Function} iterator
 * @return {Promise}
 */
const mapSeries = Promise.mapSeries || function promiseMapSeries(iterable, iterator) {
  const { length } = iterable;
  const results = new Array(length);
  let i = 0;

  function iterateOverResults() {
    return iterator(iterable[i], i, iterable).then((result) => {
      results[i] = result;
      i += 1;
      if (i < length) {
        return iterateOverResults();
      }

      return results;
    });
  }

  return iterateOverResults();
};

/**
 * We need to iterate over all components for specified routes.
 * Components array can include objects if named components are used:
 * https://github.com/rackt/react-router/blob/latest/docs/API.md#named-components
 *
 * @param components
 * @param iterator
 */
export function eachComponents(components, iterator) {
  const l = components.length;
  for (let i = 0; i < l; i += 1) {
    const component = components[i];
    if (typeof component === 'object') {
      const keys = Object.keys(component);
      keys.forEach(key => iterator(component[key], i, key));
    } else {
      iterator(component, i);
    }
  }
}

/**
 * Returns flattened array of components that are wrapped with reduxAsyncConnect
 * @param  {Array} components
 * @return {Array}
 */
export function filterAndFlattenComponents(components) {
  const flattened = [];
  eachComponents(components, (component) => {
    if (component && component.reduxAsyncConnect) {
      flattened.push(component);
    }
  });
  return flattened;
}

/**
 * @param component
 * @return {Promise<*>}
 */
async function getAsyncComponent(component /* the result of matchRoutes */ ) {
    const res = await component.preload();

    return res.default || res;
}

/**
 * @todo refactor, commit to redux-connect
 *
 * Returns an array of components that are wrapped
 * with reduxAsyncConnect
 * @param  {Array} branch
 * @return {Array}
 */
export async function filterComponents(branch) {

    return await branch.reduce(async (result, { route, match }) => {
     if(route.component.preload){
     const asyncComponent =  await getAsyncComponent(route.component);
         if (asyncComponent && asyncComponent.reduxAsyncConnect) {
             return [...(await result), ...[[asyncComponent, { route, match }]]]
         }
     }else{
         if (route.component && route.component.reduxAsyncConnect) {
             return [...(await result), ...[[route.component, { route, match }]]]
         }
     }

    return result;
  }, []);
}

/**
 * @todo refactor, commit to redux-connect
 *
 * Function that accepts components with reduxAsyncConnect definitions
 * and loads data
 * @param  {Object} data.routes - static route configuration
 * @param  {String} data.location - location object e.g. { pathname, query, ... }
 * @param  {Function} [data.filter] - filtering function
 * @return {Promise}
 */
export async function loadAsyncConnect({
  location,
  routes = [],
  filter = () => true,
  ...rest
}) {
  const layered = await filterComponents(matchRoutes(routes, location.pathname));

  if (layered.length === 0) {
    return Promise.resolve();
  }

  // this allows us to have nested promises, that rely on each other's completion
  // cycle
  return mapSeries(layered, ([component, routeParams]) => {
    if (component == null) {
      return Promise.resolve();
    }

    // Collect the results of each component
    const results = [];
    const asyncItemsArr = [];
    const asyncItems = component.reduxAsyncConnect;
    asyncItemsArr.push(...asyncItems);

      // get array of results
    results.push(...asyncItems.reduce((itemsResults, item) => {
      if (filter(item, component)) {
        let promiseOrResult = item.promise({
          ...rest,
          ...routeParams,
          location,
          routes,
        });

        if (isPromise(promiseOrResult)) {
          promiseOrResult = promiseOrResult.catch(error => ({ error }));
        }

        itemsResults.push(promiseOrResult);
      }

        return itemsResults;
    }, []));

    return Promise.all(results)
      .then(finalResults => finalResults.reduce((finalResult, result, idx) => {
        const { key } = asyncItemsArr[idx];
        if (key) {
          finalResult[key] = result;
        }

        return finalResult;
      }, {}));
  });
}

/**
 * Helper to load data on server
 * @param  {Mixed} args
 * @return {Promise}
 */
export function loadOnServer(args) {
  return loadAsyncConnect(args).then(() => {
    args.store.dispatch(endGlobalLoad());
  });
}
