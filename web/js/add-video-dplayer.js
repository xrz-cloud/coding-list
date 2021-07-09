function loadResources(type, src, callback) {
  let script = document.createElement(type);
  let loaded = false;
  if (typeof callback === "function") {
    script.onload = script.onreadystatechange = () => {
      if (!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))) {
        script.onload = script.onreadystatechange = null;
        loaded = true;
        callback();
      }
    }
  }
  if (type === "link") {
    script.href = src;
    script.rel = "stylesheet";
  } else {
    script.src = src;
  }
  document.getElementsByTagName("head")[0].appendChild(script);
}
function addVideos(videos) {
  let host = "https://s0.pstatp.com/cdn/expire-1-M";
  let unloadedResourceCount = 4;
  let callback = (() => {
    return () => {
      if (!--unloadedResourceCount) {
        createDplayers(videos);
      }
    };
  })(unloadedResourceCount, videos);
  loadResources(
    "link",
    host + "/dplayer/1.25.0/DPlayer.min.css",
    callback
  );
  loadResources(
    "script",
    host + "/dplayer/1.25.0/DPlayer.min.js",
    callback
  );
  loadResources(
    "script",
    host + "/hls.js/0.12.4/hls.light.min.js",
    callback
  );
  loadResources(
    "script",
    host + "/flv.js/1.5.0/flv.min.js",
    callback
  );
}
function createDplayers(videos) {

  for (i = 0; i < videos.length; i++) {
    console.log(videos[i]);
    new DPlayer({
      container: document.getElementById("video-a" + i),
      screenshot: true,
      video: {
        url: videos[i]
      }
    });
  }
}