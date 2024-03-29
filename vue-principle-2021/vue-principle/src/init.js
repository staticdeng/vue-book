import { initState } from "./state";
import { compileToFunctions } from "./compiler/index";
import { callHook, mountComponent } from "./lifecycle";
import { mergeOptions } from "./util";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 将配置项挂载到实例vm上：vm.$options就可以访问配置项
    const vm = this;

    // 将局部组件的options和全局options合并
    vm.$options = mergeOptions(vm.constructor.options, options);
    // vm.$options = options;

    callHook(vm, 'beforeCreate');
    // 初始化状态
    initState(vm);
    callHook(vm, 'created');

    // 模板编译
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }
  // 挂载
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    // console.log(el);
    vm.$el = el;
    
    if (!options.render) {
      // 配置项无render取template
      let template = options.template;
      if (!template && el) {
        // 无template有el，取el里html内容
        template = el.outerHTML;
      }
      // 编译原理：将模板编译成render函数
      const render = compileToFunctions(template);
      options.render = render;
    }

    // 挂载组件
    mountComponent(vm, el);
  }
}