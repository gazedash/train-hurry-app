import { configure, shallow, mount } from "enzyme";

const shallowWithStore = (component, store) => {
  const context = {
    store
  };
  return shallow(component, { context });
};

const mountWithStore = (component, store) => {
    const context = {
      store
    };
    return mount(component, { context });
  };

import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

global.shallowWithStore = shallowWithStore;
global.mountWithStore = mountWithStore;
