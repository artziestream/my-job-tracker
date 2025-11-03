import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// PrimeVue Core
import PrimeVue from 'primevue/config';

// PrimeVue Dark Theme
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

// PrimeVue Icons
import 'primeicons/primeicons.css';

// Apollo Client setup
import { apolloClient } from './apollo/client';
import { DefaultApolloClient } from '@vue/apollo-composable';

// Dark theme preset
const DarkPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}',
        },
    },
});

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
    theme: {
        preset: DarkPreset,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark-mode',
            cssLayer: false,
        },
    },
});

app.provide(DefaultApolloClient, apolloClient);

app.mount('#app');