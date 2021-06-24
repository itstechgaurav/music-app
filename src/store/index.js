import { createStore } from 'vuex';
import { Howl } from 'howler';
import router from '@/router/';
import moment from 'moment';
import notifications from './notifications';
import users from './users';

const store = {
  state: {
    ...notifications.state,
    ...users.state,
    song: {},
    isPlaying: false,
    howl: null,
  },
  mutations: {
    ...notifications.mutations,
    ...users.mutations,
    playSong(state) {
      if (state.howl) {
        state.song.howlId = state.howl.play();
        state.isPlaying = true;
      }
    },
    pauseSong(state) {
      if (state.howl) {
        state.howl.pause(state.song.howlId);
        state.isPlaying = false;
      }
    },
    isPlaying(state, songId) {
      if (songId && state.howl) {
        return state.isPlaying && state.song.songId === songId;
      }
      return state.isPlaying;
    },
  },
  getters: {
    ...notifications.getters,
    ...users.getters,
    isPlaying(state) {
      return state.isPlaying;
    },
    isPlayingCurrent(state) {
      return state.isPlaying && state.song.songId === router.currentRoute.value.params.songId;
    },
    currentSong(state) {
      return state.song;
    },
    playedTime(state) {
      return moment
        .unix(state.song.currentTime)
        .utc()
        .format('HH:mm:ss');
    },
    totalTime(state) {
      return moment
        .unix(state.song.totalTime)
        .utc()
        .format('HH:mm:ss');
    },
    songProgress(state) {
      return state.song.progress;
    },
    isPlayerReady(state) {
      return state.howl !== null;
    },
    songMeta(state) {
      return {
        currentTime: state.song.currentTime,
        totalTime: state.song.TotalTime,
      };
    },
  },
  actions: {
    ...notifications.actions,
    ...users.actions,
    initializeSong({ state, dispatch }, song) {
      if (state.howl) {
        state.howl.unload();
        state.howl = null;
      }
      state.song = {
        ...song,
        totalTime: 0,
        currentTime: 0,
        progress: 0,
      };
      state.tmpHowl = new Howl({
        src: [song.url],
        html5: true,
        onload: () => {
          state.howl = state.tmpHowl;
          dispatch('addEventsOnSong');
          state.howl.play();
          state.isPlaying = true;
        },
      });
    },
    addEventsOnSong({ state, dispatch }) {
      state.howl.on('end', () => {
        state.isPlaying = false;
      });

      state.howl.on('play', () => {
        dispatch('progress');
      });
    },
    progress({ state, dispatch }) {
      if (state.howl) state.song.currentTime = state.howl.seek();
      if (state.howl) state.song.totalTime = state.howl.duration();
      if (state.howl) state.song.progress = state.song.currentTime / state.song.totalTime;

      if (state.howl && state.howl.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    seekTo({ state, commit, dispatch }, skipTo) {
      if (state.isPlaying) {
        commit('pauseSong');
        state.howl.seek(skipTo);
        dispatch('progress');
        commit('playSong');
      } else {
        state.howl.seek(skipTo);
        dispatch('progress');
      }
    },
    changeSong({ commit, state, dispatch }, song) {
      if (song.songId === state.song.songId && state.isPlaying) {
        commit('pauseSong');
      } else if (song.songId === state.song.songId && !state.isPlaying) {
        commit('playSong');
      } else {
        dispatch('initializeSong', song);
      }
    },
    togglePlay({ state, commit }) {
      if (state.song && state.howl && state.isPlaying) commit('pauseSong');
      else if (state.song && state.howl && !state.isPlaying) commit('playSong');
    },
  },
  modules: {},
};

export default createStore(store);
