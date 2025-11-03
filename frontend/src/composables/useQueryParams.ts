import { ref, watch, type Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function useQueryParams<T extends Record<string, any>>(
    defaultFilters: T
): { filters: Ref<T> } {
    const router = useRouter();
    const route = useRoute();

    const filters = ref<T>({ ...defaultFilters }) as Ref<T>;

    Object.keys(defaultFilters).forEach((key) => {
        if (route.query[key]) {
            (filters.value as any)[key] = route.query[key];
        }
    });

    watch(
        filters,
        (newFilters) => {
            const query: any = {};
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value) query[key] = value;
            });
            router.replace({ query });
        },
        { deep: true }
    );

    watch(
        () => route.query,
        (newQuery) => {
            Object.keys(defaultFilters).forEach((key) => {
                (filters.value as any)[key] = newQuery[key] || defaultFilters[key];
            });
        }
    );

    return { filters };
}