import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const HelloWorld = (resolve) => {
  import('@/components/HelloWorld').then((module) => {
    resolve(module);
  });
};

const Eye = (resolve) => {
  import('@/components/eye').then((module) => {
    resolve(module);
  });
};

const EyeHome = (resolve) => {
  import('@/components/eye/Home').then((module) => {
    resolve(module);
  });
};

const EyeAbout = (resolve) => {
  import('@/components/eye/About').then((module) => {
    resolve(module);
  });
};

const Story = (resolve) => {
  import('@/components/story').then((module) => {
    resolve(module);
  });
};

const StoryHome = (resolve) => {
  import('@/components/story/Home').then((module) => {
    resolve(module);
  });
};

const StoryAbout = (resolve) => {
  import('@/components/story/About').then((module) => {
    resolve(module);
  });
};

const House = (resolve) => {
  import('@/components/house').then((module) => {
    resolve(module);
  });
};

const HouseHome = (resolve) => {
  import('@/components/house/Home').then((module) => {
    resolve(module);
  });
};

const Candy = (resolve) => {
  import('@/components/candy').then((module) => {
    resolve(module);
  });
};

const CandyHome = (resolve) => {
  import('@/components/candy/Home').then((module) => {
    resolve(module);
  });
};

const CandyList = (resolve) => {
  import('@/components/candy/List').then((module) => {
    resolve(module);
  });
};

const CandyCreate = (resolve) => {
  import('@/components/candy/Create').then((module) => {
    resolve(module);
  });
};

const CandyDetail = (resolve) => {
  import('@/components/candy/Detail').then((module) => {
    resolve(module);
  });
};

const CandyAbout = (resolve) => {
  import('@/components/candy/About').then((module) => {
    resolve(module);
  });
};

const Question = (resolve) => {
  import('@/components/question').then((module) => {
    resolve(module);
  });
};

const QuestionList = (resolve) => {
  import('@/components/question/list').then((module) => {
    resolve(module);
  });
};

const QuestionCreate = (resolve) => {
  import('@/components/question/create').then((module) => {
    resolve(module);
  });
};

const QuestionDetail = (resolve) => {
  import('@/components/question/detail').then((module) => {
    resolve(module);
  });
};

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
      path: '/eye/about',
      name: 'EyeAbout',
      component: EyeAbout
    },
    {
      path: '/story',
      name: 'Story',
      component: Story
    },
    {
      path: '/story/about',
      name: 'StoryAbout',
      component: StoryAbout
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
    },
    {
      path: '/candy/home',
      name: 'Candy',
      component: Candy
    },
    {
      path: '/candy',
      name: 'CandyHome',
      component: CandyHome,
      children: [
        {
          path: '/',
          component: CandyList
        },
        {
          path: 'add',
          component: CandyCreate
        },
        {
          path: 'about',
          component: CandyAbout
        },
        {
          path: 'detail/:id',
          component: CandyDetail
        }
      ]
    },
    {
      path: '/question',
      name: 'Question',
      component: Question,
      children: [
        {
          path: 'list',
          component: QuestionList
        },
        {
          path: 'create',
          component: QuestionCreate
        },
        {
          path: 'detail/:id',
          component: QuestionDetail
        }
      ]
    }
  ]
});
