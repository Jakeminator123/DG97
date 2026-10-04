/* DG97 room films: one quiet play on entry, optional hover replay. */
(function () {
  'use strict';
  var videos = Array.from(document.querySelectorAll('video[data-dg-room-video]'));
  if (!videos.length || !('IntersectionObserver' in window)) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var states = new WeakMap();
  function pause(video, state) {
    if (!video.paused) { state.internalPause = true; video.pause(); }
  }
  function play(video, state) {
    if (document.hidden || reduced.matches || !state.visible || state.finished || state.userPaused) return;
    state.begun = true;
    video.dataset.dgPlayback = 'started';
    var promise = video.play();
    if (promise && promise.catch) promise.catch(function () {
      state.userPaused = true;
      video.dataset.dgPlayback = 'manual';
    });
  }
  videos.forEach(function (video) {
    if (video.dataset.dgInitialized) return;
    video.dataset.dgInitialized = 'true';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = false;
    video.playsInline = true;
    video.playbackRate = 0.9;
    var state = { visible: false, begun: false, finished: false, userPaused: false, internalPause: false };
    states.set(video, state);
    video.addEventListener('ended', function () {
      state.finished = true;
      video.dataset.dgPlayback = 'finished';
    });
    video.addEventListener('pause', function () {
      if (state.internalPause) { state.internalPause = false; return; }
      if (!video.ended && state.begun) state.userPaused = true;
    });
    video.addEventListener('play', function () {
      state.begun = true;
      state.userPaused = false;
    });
    video.addEventListener('mouseenter', function () {
      if (!hover.matches || reduced.matches || !state.finished || !state.visible || document.hidden) return;
      state.finished = false;
      state.userPaused = false;
      video.currentTime = 0;
      play(video, state);
    });
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target, state = states.get(video);
      if (!state) return;
      state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      if (state.visible) play(video, state);
      else pause(video, state);
    });
  }, { threshold: [0, 0.25] });
  videos.forEach(function (video) { if (states.has(video)) observer.observe(video); });
  document.addEventListener('visibilitychange', function () {
    videos.forEach(function (video) {
      var state = states.get(video);
      if (!state) return;
      if (document.hidden) pause(video, state);
      else play(video, state);
    });
  });
  reduced.addEventListener('change', function () {
    videos.forEach(function (video) {
      var state = states.get(video);
      if (!state) return;
      if (reduced.matches) pause(video, state);
      else play(video, state);
    });
  });
}());
