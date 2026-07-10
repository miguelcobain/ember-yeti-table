import { defineAsyncComponent } from './chunk-5MNB462L.js';

// ../node_modules/.pnpm/vite-plugin-ember@0.4.0_@glimmer+component@2.1.1_ember-source@6.12.0_@glimmer+component_dd043ece29bfd7a3319a2f3dda8d5fd8/node_modules/vite-plugin-ember/dist/vitepress/constants.js
var EMBER_OWNER_KEY = Symbol.for('vite-plugin-ember:owner');

// ../node_modules/.pnpm/vite-plugin-ember@0.4.0_@glimmer+component@2.1.1_ember-source@6.12.0_@glimmer+component_dd043ece29bfd7a3319a2f3dda8d5fd8/node_modules/vite-plugin-ember/dist/vitepress/create-owner.js
function createOwner() {
  const services = /* @__PURE__ */ new Map();
  return {
    register(fullName, instance) {
      services.set(fullName, instance);
    },
    lookup(fullName) {
      return services.get(fullName);
    },
  };
}

// ../node_modules/.pnpm/vite-plugin-ember@0.4.0_@glimmer+component@2.1.1_ember-source@6.12.0_@glimmer+component_dd043ece29bfd7a3319a2f3dda8d5fd8/node_modules/vite-plugin-ember/dist/vitepress/setup.js
function setupEmber(app, options = {}) {
  const { services, componentName = 'CodePreview' } = options;
  const owner = options.owner ?? createOwner();
  if (services) {
    for (const [name, instance] of Object.entries(services)) {
      owner.register(`service:${name}`, instance);
    }
  }
  const CodePreview = defineAsyncComponent(
    () =>
      import('/Users/amauryd/Projects/triptyk-table/node_modules/.pnpm/vite-plugin-ember@0.4.0_@glimmer+component@2.1.1_ember-source@6.12.0_@glimmer+component_dd043ece29bfd7a3319a2f3dda8d5fd8/node_modules/vite-plugin-ember/src/vitepress/code-preview.vue'),
  );
  app.component(componentName, CodePreview);
  app.provide(EMBER_OWNER_KEY, owner);
  return owner;
}
export { EMBER_OWNER_KEY, createOwner, setupEmber };
//# sourceMappingURL=vite-plugin-ember_setup.js.map
