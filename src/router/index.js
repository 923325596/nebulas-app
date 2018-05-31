import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Eye from '@/components/eye';
import EyeHome from '@/components/eye/Home';
import Vote from '@/components/Vote';
import Story from '@/components/story';
import StoryHome from '@/components/story/Home';
import House from '@/components/house';
import HouseHome from '@/components/house/Home';

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
      component: EyeHome
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
      component: StoryHome
    },
    {
      path: '/house',
      name: 'House',
      component: House
    },
    {
      path: '/house/detail',
      name: 'Detail',
      component: HouseHome
    }
  ]
});
