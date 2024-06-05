export const loadRemote = (
  remote,
  sharedScope,
  module,
  url,
) => {
  return async function () {
    try {
      if (!remote || !url || !module) {
        throw new Error('No remote info specified');
      }

      await getOrLoadRemote(remote, sharedScope, url);

      const container = window[remote];
      const factory = await container.get(module);
      const Module = factory();

      return Module;
    } catch (e) {
      console.log(e);
      return { default: null };
    }
  };
};

export const getOrLoadRemote = (
  remote,
  shareScope,
  remoteFallbackUrl,
) =>
  new Promise((resolve, reject) => {
    if (window[remote]) {
      resolve();

      return;
    }

    const onload = async () => {
      if (!window[remote]) {
        reject('Invalid remote name');
        return;
      }

      if (!window[remote].__initialized) {
        if (typeof __webpack_share_scopes__ === 'undefined') {
          await window[remote].init(shareScope.default);
        } else {
          await window[remote].init(__webpack_share_scopes__[shareScope]);
        }
        window[remote].__initialized = true;
      }

      resolve();
    };

    const existingRemote = document.querySelector(`[data-webpack="${remote}"]`);

    if (existingRemote) {
      existingRemote.onload = onload;
      existingRemote.onerror = reject;

      if (window[remote]?.__initialized) {
        resolve();
      } else {
        reject(`Cannot init remote ${remote}`);
      }
    } else if (remoteFallbackUrl) {
      const script = document.createElement('script');

      script.type = 'text/javascript';
      script.setAttribute('data-webpack', `${remote}`);
      script.async = true;
      script.onerror = reject;
      script.onload = onload;
      script.src = remoteFallbackUrl;

      document.getElementsByTagName('head')[0].appendChild(script);
    } else {
      reject(`Cannot find remote ${remote} to inject`);
    }
  });
