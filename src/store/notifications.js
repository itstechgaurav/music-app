export default {
  state: {
    notifications: [],
  },
  getters: {
    getNotifications(state) {
      return state.notifications;
    },
  },
  mutations: {
    updateNotification(state, newData) {
      const noti = state.notifications.find((notification) => notification.id === newData.id);
      if (noti) {
        noti.text = newData.text;
        noti.type = newData.type;
      }
    },
    removeNotification(state, notification_) {
      // first find out the notification
      const notiIndex = state.notifications.findIndex((noti) => noti.id === notification_.id);

      if (notiIndex !== -1) {
        state.notifications.splice(notiIndex, 1);
      }

      if (notification_.timeout) clearTimeout(notification_.timeout);
    },
  },
  actions: {
    addNotification({ commit, state }, notification_) {
      const notification = {
        ...notification_,
      };
      notification.id = Date.now();
      // after 3 second remove the notification
      notification.timeOut = setTimeout(() => {
        if (notification.duration !== 0) commit('removeNotification', notification);
      }, notification.duration || 3000);

      state.notifications.push(notification);

      return notification.id;
    },
  },
};
