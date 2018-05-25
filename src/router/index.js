import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Eye from '@/components/Eye';
import Home from '@/components/Home';
import Vote from '@/components/Vote';
import Story from '@/components/Story';
import List from '@/components/List';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/eye',
      name: 'Eye',
      component: Eye
    },
    {
      path: '/eye/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/vote',
      name: 'Vote',
      component: Vote
    },
    {
      path: '/story',
      name: 'Story',
      component: Story
    },
    {
      path: '/story/list',
      name: 'StoryList',
      component: List
    }
  ]
});
