<template>
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">
          {{ $tc('song.comment_count', song.comment_count, { count: song.comment_count }) }}
        </span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <form @submit.prevent.stop="createComment" v-if="isLogedIn">
          <textarea
            v-model="formData.text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."></textarea>
          <button
            type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block">
              Submit
          </button>
        </form>
        <!-- Sort Comments -->
        <select
          v-model="filter.sortBy"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  </section>

  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      v-for="comment, index in comments" :key="index"
      class="p-6 bg-gray-50 border border-gray-200">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.display_name }}</div>
        <time>{{ formatDate(comment.created_at) }}</time>
      </div>

      <p>
        {{
          comment.text
        }}
      </p>
    </li>
  </ul>
</template>

<script>

import {
  songsCollection,
  commentsCollection,
  firestore,
  auth,
} from '@/includes/firebase';
import { mapState } from 'vuex';

export default {
  name: 'Comments',
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      filter: {
        sortBy: 'oldest',
      },
      formData: {
        text: '',
      },
      comments: [],
    };
  },
  created() {
    // this.filter.sortBy = this.$route.query.sortBy || 'latest';
  },
  watch: {
    // eslint-disable-next-line vue/no-arrow-functions-in-watch
    // eslint-disable-next-line object-shorthand
    'filter.sortBy'(newValue) {
      this.$router.push({
        name: 'song',
        query: {
          sortBy: newValue,
        },
      });
      this.loadComments();
    },
  },
  computed: {
    ...mapState(['isLogedIn']),
  },
  methods: {
    formatDate(date) {
      if (!date) return 'Just now';
      const createdAt = new firestore.Timestamp(date.seconds, date.nanoseconds);
      const readable = createdAt.toDate().toLocaleTimeString();
      return readable;
    },
    createComment() {
      if (this.formData.text.trim().length !== 0) {
        const comment = {
          ...this.formData,
          uid: auth.currentUser.uid,
          display_name: auth.currentUser.displayName,
          songId: this.song.songId,
          created_at: firestore.FieldValue.serverTimestamp(),
        };

        commentsCollection
          .add(comment)
          .then(async (res) => {
            this.comments.unshift({
              ...comment,
              commentId: res.id,
              created_at: false,
            });

            // update the song comment count

            await songsCollection.doc(this.song.songId).update(
              {
                comment_count: firestore.FieldValue.increment(1),
              },
            );

            // update local comment_count
          });
      }
    },
    loadComments() {
      let isAccending = true;
      if (this.$route.query.sortBy && this.$route.query.sortBy === 'latest') {
        isAccending = false;
      }
      commentsCollection
        .where('songId', '==', this.song.songId)
        .orderBy('created_at', isAccending ? 'asc' : 'desc')
        .get()
        .then((docs) => {
          this.comments = [];
          docs.forEach((comment) => {
            this.comments.push({
              commentId: comment.id,
              ...comment.data(),
            });
          });
        });
    },
  },
  mounted() {
    this.loadComments();
  },
  beforeUpdate() {
    this.loadComments();
  },
};
</script>
