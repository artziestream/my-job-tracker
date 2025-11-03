<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import Tag from 'primevue/tag';
import PageLayout from '../components/PageLayout.vue';
import CrudTable from '../components/CrudTable.vue';
import FilterBar from '../components/FilterBar.vue';
import ContactsList from '../components/ContactsList.vue';
import ApplicationForm from '../components/forms/ApplicationForm.vue';
import { useQueryParams } from '../composables/useQueryParams';
import { usePriorityCalculator } from '../composables/usePriorityCalculator';
import {
  statusOptions,
  priorityOptions,
  remoteTypeOptions,
  preferenceOptions,
  getSeverity,
  getLabel,
} from '../constants/options';
import {
  APPLICATIONS_QUERY,
  COMPANIES_LIST_QUERY,
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  DELETE_APPLICATION,
} from '../graphql/applications';

// =====================================================================
// GRAPHQL QUERIES
// =====================================================================
const { result, loading, error, refetch } = useQuery(APPLICATIONS_QUERY);
const { result: companiesResult } = useQuery(COMPANIES_LIST_QUERY);

const applications = ref<any[]>([]);
const companies = ref<any[]>([]);

watch(
  result,
  (newResult) => {
    if (newResult?.applications) {
      applications.value = newResult.applications;
    }
  },
  { immediate: true }
);

watch(
  companiesResult,
  (newResult) => {
    if (newResult?.companies) {
      companies.value = newResult.companies;
    }
  },
  { immediate: true }
);

// =====================================================================
// MUTATIONS
// =====================================================================
const { mutate: createApplication } = useMutation(CREATE_APPLICATION);
const { mutate: updateApplication } = useMutation(UPDATE_APPLICATION);
const { mutate: deleteApplication } = useMutation(DELETE_APPLICATION);

// =====================================================================
// FILTERS
// =====================================================================
const { filters } = useQueryParams({
  jobTitle: '',
  companyName: '',
  location: '',
  status: null,
  priority: null,
  remoteType: null,
  preference: null,
});

const { calculatePriority } = usePriorityCalculator();

// =====================================================================
// DIALOG & UI STATE
// =====================================================================
const showDialog = ref(false);
const editingApplication = ref<any>(null);

const selectedApplicationForContacts = ref<any>(null);
const showContactsListDialog = ref(false);

const openContactsList = (app: any) => {
  selectedApplicationForContacts.value = app;
  showContactsListDialog.value = true;
};

// =====================================================================
// UTILITIES
// =====================================================================
const formatDate = (input?: string | number) => {
  if (!input) return '-';

  try {
    let d: Date;

    // handle epoch in string or number form
    if (typeof input === 'number' || /^\d+$/.test(String(input))) {
      d = new Date(Number(input));
    } else {
      d = new Date(input);
    }

    if (isNaN(d.getTime())) return String(input); // fallback if invalid

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(input);
  }
};

const isExpired = (postingEndDate?: string, status?: string) => {
  if (!postingEndDate || status !== 'NOT_STARTED') return false;
  try {
    const endDate = new Date(postingEndDate);
    const now = new Date();
    return endDate < now;
  } catch {
    return false;
  }
};

// =====================================================================
// FILTERED DATA
// =====================================================================
const filteredApplications = computed(() => {
  let result = applications.value;

  if (filters.value.jobTitle) {
    const search = filters.value.jobTitle.toLowerCase();
    result = result.filter((a) => a.jobTitle.toLowerCase().includes(search));
  }

  if (filters.value.companyName) {
    const search = filters.value.companyName.toLowerCase();
    result = result.filter((a) => a.company.name.toLowerCase().includes(search));
  }

  if (filters.value.location) {
    const search = filters.value.location.toLowerCase();
    result = result.filter(
      (a) => a.location && a.location.toLowerCase().includes(search)
    );
  }

  if (filters.value.status) {
    result = result.filter((a) => a.status === filters.value.status);
  }

  if (filters.value.priority) {
    result = result.filter((a) => a.priority === filters.value.priority);
  }

  if (filters.value.remoteType) {
    result = result.filter((a) => a.remoteType === filters.value.remoteType);
  }

  if (filters.value.preference) {
    result = result.filter((a) => a.preference === filters.value.preference);
  }

  return result;
});

// =====================================================================
// COLUMN CONFIGURATION
// =====================================================================
const availableColumns = [
  { field: 'jobTitle', header: 'Job Title', sortable: true },
  { field: 'company.name', header: 'Company', sortable: true },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'priority', header: 'Priority', sortable: true },
  { field: 'location', header: 'Location', sortable: false },
  { field: 'remoteType', header: 'Remote Type', sortable: false },
  { field: 'contactLinks', header: 'Contacts', sortable: false },
  { field: 'preference', header: 'Preference', sortable: false },
  { field: 'salaryMin', header: 'Min Salary', sortable: true },
  { field: 'salaryMax', header: 'Max Salary', sortable: true },
  { field: 'postedDate', header: 'Posted Date', sortable: true },
  { field: 'postingEndDate', header: 'Posting End Date', sortable: true },
  { field: 'appliedDate', header: 'Applied Date', sortable: true },
  { field: 'offerDeadline', header: 'Offer Deadline', sortable: true },
  { field: 'comments', header: 'Comments', sortable: false },
];

// Default columns (subset)
const selectedColumns = ref(
  availableColumns.filter((c) =>
    ['jobTitle', 'company.name', 'status', 'priority', 'location', 'contactLinks'].includes(c.field)
  )
);

// =====================================================================
// FILTERBAR CONFIG
// =====================================================================
const filterFields = [
  {
    key: 'jobTitle',
    label: 'Search by Job Title',
    type: 'text' as const,
    placeholder: 'Type to search...',
  },
  {
    key: 'companyName',
    label: 'Search by Company',
    type: 'text' as const,
    placeholder: 'Company name...',
  },
  {
    key: 'location',
    label: 'Search by Location',
    type: 'text' as const,
    placeholder: 'City, state, or country...',
  },
  {
    key: 'status',
    label: 'Filter by Status',
    type: 'select' as const,
    placeholder: 'All Statuses',
    options: statusOptions,
  },
  {
    key: 'priority',
    label: 'Filter by Priority',
    type: 'select' as const,
    placeholder: 'All Priorities',
    options: priorityOptions,
  },
  {
    key: 'remoteType',
    label: 'Filter by Remote Type',
    type: 'select' as const,
    placeholder: 'All Types',
    options: remoteTypeOptions,
  },
  {
    key: 'preference',
    label: 'Filter by Preference',
    type: 'select' as const,
    placeholder: 'All Preferences',
    options: preferenceOptions,
  },
];

// =====================================================================
// ACTIONS
// =====================================================================
const openCreateDialog = () => {
  editingApplication.value = null;
  showDialog.value = true;
};

const openEditDialog = (app: any) => {
  editingApplication.value = app;
  showDialog.value = true;
};

const handleSaveApplication = async (data: any) => {
  try {
    const company = companies.value.find((c) => c.id === data.companyId);
    const hasContacts = company?.contactLinks && company.contactLinks.length > 0;

    const priority = calculatePriority({
      postedDate: data.postedDate,
      postingEndDate: data.postingEndDate,
      preference: data.preference,
      hasContacts,
    });

    const input = { ...data, priority };

    if (editingApplication.value) {
      await updateApplication({ id: editingApplication.value.id, input });
    } else {
      await createApplication({ input });
    }

    showDialog.value = false;
    refetch();
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

const handleDelete = async (id: string) => {
  if (confirm('Delete this application?')) {
    try {
      await deleteApplication({ id });
      refetch();
    } catch (err) {
      console.error('Error:', err);
    }
  }
};

const handleContactsUpdated = async () => {
  await refetch()
  const appId = selectedApplicationForContacts.value?.id
  if (appId && result.value?.applications) {
    const updated = result.value.applications.find((a: { id: any; }) => a.id === appId)
    if (updated) selectedApplicationForContacts.value = { ...updated }
  }
}
</script>

<template>
  <PageLayout title="Applications">
    <template #actions>
      <Button label="Add Application" icon="pi pi-plus" @click="openCreateDialog" />
    </template>

    <FilterBar :filters="filters" :fields="filterFields" @update:filters="filters = $event" />

    <div class="column-selector">
      <span class="label">Visible Columns:</span>
      <MultiSelect v-model="selectedColumns" :options="availableColumns" option-label="header" display="chip"
        placeholder="Choose columns" class="column-multiselect" />
      <Button label="Select All" icon="pi pi-check-square" text size="small"
        @click="selectedColumns = [...availableColumns]" />
    </div>

    <CrudTable :data="filteredApplications" :loading="loading" :error="error" :columns="selectedColumns"
      @delete="handleDelete" @edit="openEditDialog">
      <template #cell-jobTitle="{ data }">
        <a v-if="data.linkedinUrl || data.companyJobUrl" :href="data.linkedinUrl || data.companyJobUrl" target="_blank"
          rel="noopener noreferrer" class="job-link">
          {{ data.jobTitle }}
          <i class="pi pi-external-link" style="font-size: 0.75rem; margin-left: 0.25rem;"></i>
        </a>
        <span v-else>{{ data.jobTitle }}</span>
      </template>

      <template #cell-company.name="{ data }">
        <router-link :to="`/companies?name=${data.company.name}`" class="company-link">
          {{ data.company.name }}
        </router-link>
      </template>

      <template #cell-status="{ data }">
        <Tag v-if="data.status" :value="getLabel(statusOptions, data.status)"
          :severity="getSeverity(statusOptions, data.status)" />
        <span v-else>-</span>
      </template>

      <template #cell-priority="{ data }">
        <Tag v-if="data.priority" :value="getLabel(priorityOptions, data.priority)"
          :severity="getSeverity(priorityOptions, data.priority)" />
        <span v-else>-</span>
      </template>

      <template #cell-remoteType="{ data }">
        <Tag v-if="data.remoteType" :value="getLabel(remoteTypeOptions, data.remoteType)"
          :severity="getSeverity(remoteTypeOptions, data.remoteType)" />
        <span v-else>-</span>
      </template>

      <template #cell-preference="{ data }">
        <Tag v-if="data.preference" :value="getLabel(preferenceOptions, data.preference)"
          :severity="getSeverity(preferenceOptions, data.preference)" />
        <span v-else>-</span>
      </template>

      <template #cell-contactLinks="{ data }">
        <Button :label="`${data.contactLinks?.length || 0}`"
          :severity="data.contactLinks?.length > 0 ? 'info' : 'secondary'" outlined size="small"
          @click="openContactsList(data)" />
      </template>

      <template #cell-postedDate="{ data }">
        {{ formatDate(data.postedDate) }}
      </template>

      <template #cell-postingEndDate="{ data }">
        <span v-if="isExpired(data.postingEndDate, data.status)" class="expired-tag">
          <Tag value="EXPIRED" severity="danger" />
        </span>
        <span v-else>{{ formatDate(data.postingEndDate) }}</span>
      </template>

      <template #cell-appliedDate="{ data }">
        {{ formatDate(data.appliedDate) }}
      </template>

      <template #cell-offerDeadline="{ data }">
        {{ formatDate(data.offerDeadline) }}
      </template>
    </CrudTable>

    <Dialog v-model:visible="showDialog" modal :header="editingApplication ? 'Edit Application' : 'Create Application'"
      :style="{ width: '50rem' }">
      <ApplicationForm :initial-data="editingApplication" :companies="companies" @save="handleSaveApplication"
        @cancel="showDialog = false" />
    </Dialog>

    <ContactsList :company="null" :application="selectedApplicationForContacts" :visible="showContactsListDialog"
      @close="showContactsListDialog = false" @updated="handleContactsUpdated" />
  </PageLayout>
</template>

<style scoped>
.job-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.job-link:hover {
  text-decoration: underline;
}

.company-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}

.company-link:hover {
  text-decoration: underline;
}

.column-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  width: 100%;
}

.label {
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

.column-multiselect {
  flex: 1;
  min-width: 20rem;
}

.expired-tag {
  display: inline-flex;
  align-items: center;
}
</style>