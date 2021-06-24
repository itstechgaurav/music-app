import { auth, usersCollection } from '@/includes/firebase';

export default {
  state: {
    isLogedIn: false,
    authModelShow: false,
  },
  getters: {
    isAuthModelOpened(state) {
      return state.authModelShow;
    },
  },
  mutations: {
    toggleAuthModel(state) {
      state.authModelShow = !state.authModelShow;
    },
    toggleLogin(state) {
      state.isLogedIn = !state.isLogedIn;
    },
  },
  actions: {
    async registerUser({ commit, dispatch }, data) {
      const noti = await dispatch('addNotification', {
        type: 'info',
        text: 'Registration under process...',
        duration: 20000,
      });
      let request;

      try {
        request = await auth.createUserWithEmailAndPassword(data.email, data.password);

        await usersCollection.doc(request.user.uid).set({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        console.log(data.name);
        await request.user.updateProfile({
          displayName: data.name,
        });

        commit('updateNotification', {
          id: noti,
          text: `Welcome to the community ${data.name.split(' ')[0]}`,
          type: 'success',
        });

        commit('toggleLogin');
        commit('toggleAuthModel');
      } catch (error) {
        console.log(error);
        console.log(error);
        commit('updateNotification', {
          id: noti,
          text: 'Unable to Register the user',
          type: 'danger',
        });
        return 0;
      }

      return 0;
    },
    async loginUser({ commit, dispatch }, data) {
      try {
        const user = await auth.signInWithEmailAndPassword(data.email, data.password);
        commit('toggleLogin');
        commit('toggleAuthModel');
        await dispatch('addNotification', {
          type: 'success',
          text: `Welcome back ${user.user.displayName}`,
        });
      } catch (error) {
        await dispatch('addNotification', {
          type: 'danger',
          text: 'Unable to Login.',
        });
      }
    },
    async logoutUser({ commit, dispatch }) {
      const name = auth.currentUser.displayName;
      auth
        .signOut()
        .then(() => {
          commit('toggleLogin');
          dispatch('addNotification', {
            type: 'success',
            text: `See you soon ${name}`,
          });
        })
        .catch(() => {
          dispatch('addNotification', {
            type: 'danger',
            text: 'Unable to logout.',
          });
        });
    },
    initLogin({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit('toggleLogin');
      }
    },
  },
};
