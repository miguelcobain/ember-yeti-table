import { defineConfig } from 'vitepress';
import vitePluginEmber, { emberFence } from 'vite-plugin-ember';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * `vite-plugin-ember` ships an `@embroider/macros` shim whose `importSync`
 * throws at runtime. A handful of our peer addons (`ember-resources`,
 * `reactiveweb`) call `importSync('@ember/owner')` / `importSync('@ember/application')`
 * to grab `getOwner` / `setOwner`. This plugin shadows that shim with one
 * that resolves those two specifiers via real static imports.
 */
function embroiderMacrosShim(): Plugin {
  const VIRTUAL_ID = '\0yeti-embroider-macros-shim';
  return {
    name: 'yeti-embroider-macros-shim',
    enforce: 'pre',
    resolveId(id) {
      if (id === '@embroider/macros') return VIRTUAL_ID;
      return null;
    },
    load(id) {
      if (id !== VIRTUAL_ID) return null;
      // Only import @ember/owner here. @ember/application imports from
      // @embroider/macros (this very shim), so importing it would create a
      // circular dependency that surfaces as
      //   "ReferenceError: Cannot access 'ce' before initialization"
      // when the macros shim is evaluated before @ember/application finishes
      // initializing. ember-resources / reactiveweb only fall back to
      // importSync('@ember/application') when ember-source < 4.12, which our
      // dependencySatisfies shim short-circuits with `true`.
      return `
import * as emberOwner from '@ember/owner';

const modules = {
  '@ember/owner': emberOwner,
};

export function isDevelopingApp() { return true; }
export function isTesting() { return false; }
export function macroCondition(condition) { return condition; }
export function dependencySatisfies() { return true; }
export function getOwnConfig() { return {}; }
export function getConfig() { return {}; }
export function getGlobalConfig() { return { isDevelopingApp: true, isTesting: false }; }
export function importSync(specifier) {
  const mod = modules[specifier];
  if (!mod) {
    throw new Error('[yeti-macros-shim] importSync(' + specifier + ') not supported. Add it to the shim.');
  }
  return mod;
}
`;
    },
  };
}

export default defineConfig({
  title: 'Yeti Table',
  description: 'A powerful, flexible Ember table component',
  base: process.env.BASE_URL ?? '/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/quickstart' },
      { text: 'API', link: '/api/' },
      {
        text: 'GitHub',
        link: 'https://github.com/miguelcobain/ember-yeti-table',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Quickstart', link: '/guide/quickstart' },
            { text: 'Why Yeti Table?', link: '/guide/why-yeti-table' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Defining a table', link: '/guide/general' },
            { text: 'Sorting', link: '/guide/sorting' },
            { text: 'Filtering', link: '/guide/filtering' },
            { text: 'Pagination', link: '/guide/pagination' },
            { text: 'Async data', link: '/guide/async' },
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [{ text: 'Overview', link: '/api/' }],
        },
        {
          text: 'Top-level',
          items: [
            { text: '<YetiTable />', link: '/api/yeti-table' },
            { text: 'table', link: '/api/table' },
          ],
        },
        {
          text: 'Head',
          items: [
            { text: 'header', link: '/api/header' },
            { text: 'thead', link: '/api/thead' },
            { text: 'thead.row', link: '/api/thead-row' },
            { text: 'thead.row.column', link: '/api/column' },
            { text: 'thead.row.cell', link: '/api/thead-cell' },
          ],
        },
        {
          text: 'Body',
          items: [
            { text: 'body', link: '/api/body' },
            { text: 'tbody', link: '/api/tbody' },
            { text: 'tbody.row', link: '/api/tbody-row' },
            { text: 'tbody.row.cell', link: '/api/tbody-cell' },
          ],
        },
        {
          text: 'Foot',
          items: [
            { text: 'tfoot', link: '/api/tfoot' },
            { text: 'tfoot.row', link: '/api/tfoot-row' },
            { text: 'tfoot.row.cell', link: '/api/tfoot-cell' },
          ],
        },
        {
          text: 'Pagination',
          items: [{ text: 'pagination', link: '/api/pagination' }],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/miguelcobain/ember-yeti-table',
      },
    ],
  },
  vite: {
    plugins: [embroiderMacrosShim(), vitePluginEmber()],
    resolve: {
      extensions: [
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.gts',
        '.gjs',
      ],
      alias: {
        '~docs': path.resolve(__dirname, '..'),
        'ember-yeti-table': path.resolve(__dirname, '../../dist'),
      },
    },
    ssr: {
      noExternal: [/vite-plugin-ember/],
    },
  },
  markdown: {
    config(md) {
      emberFence(md);

      // Inline code like `colspan={{table.visibleColumns.length}}` would
      // otherwise be parsed by Vue as a template interpolation during SSR.
      const originalCodeInline =
        md.renderer.rules.code_inline ??
        ((tokens, idx, opts, _env, self) =>
          self.renderToken(tokens, idx, opts));
      md.renderer.rules.code_inline = (tokens, idx, opts, env, self) => {
        const rendered = originalCodeInline(tokens, idx, opts, env, self);
        return rendered.replace(/^<code/, '<code v-pre');
      };
    },
  },
});
