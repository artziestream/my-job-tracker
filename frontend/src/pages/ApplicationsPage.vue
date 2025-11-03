<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import PageLayout from '../components/PageLayout.vue';
import CrudTable from '../components/CrudTable.vue';

const router = useRouter();
const route = useRoute();

const APPLICATIONS_QUERY = gql`
  query GetApplications {
    applications {
      id
      jobTitle
      linkedinUrl
      companyJobUrl
      priority
      salaryMin
      salaryMax
      status
      location
      remoteType
      preference
      postedDate
      postingEndDate
      appliedDate
      comments
      company {
        id
        name
      }
      contacts {
        id
        name
      }
    }
  }
`;

const COMPANIES_QUERY = gql`
  query GetCompanies {
    companies {
      id
      name
    }
  }
`;

const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
      jobTitle
      status
    }
  }
`;

const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($id: ID!, $input: UpdateApplicationInput!) {
    updateApplication(id: $id, input: $input) {
      id
      jobTitle
      status
    }
  }
`;

const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
    }
  }
`;

const { result, loading, error, refetch } = useQuery(APPLICATIONS_QUERY);
const { result: companiesResult } = useQuery(COMPANIES_QUERY);

const applications = ref<any[]>([]);
const companies = ref<any[]>([]);

watch(result, (newResult) => {
  if (newResult?.applications) {
    applications.value = newResult.applications;
  }
}, { immediate: true });

watch(companiesResult, (newResult) => {
  if (newResult?.companies) {
    companies.value = newResult.companies;
  }
}, { immediate: true });

const { mutate: createApplication } = useMutation(CREATE_APPLICATION);
const { mutate: updateApplication } = useMutation(UPDATE_APPLICATION);
const { mutate: deleteApplication } = useMutation(DELETE_APPLICATION);

const showDialog = ref(false);
const editingApplication = ref<string | null>(null);

const formData = ref({
  jobTitle: '',
  companyId: '',
  linkedinUrl: '',
  companyJobUrl: '',
  salaryMin: null as number | null,
  salaryMax: null as number | null,
  status: 'NOT_STARTED' as string,
  location: '',
  remoteType: null as string | null,
  preference: 'NEUTRAL' as string,
  postedDate: '',
  postingEndDate: '',
  appliedDate: '',
  comments: '',
});

const filters = ref({
  jobTitle: (route.query.jobTitle as string) || '',
  companyName: (route.query.companyName as string) || '',
  status: (route.query.status as string) || null,
  priority: (route.query.priority as string) || null,
  remoteType: (route.query.remoteType as string) || null,
});

watch(filters, (newFilters) => {
  const query: any = {};
  if (newFilters.jobTitle) query.jobTitle = newFilters.jobTitle;
  if (newFilters.companyName) query.companyName = newFilters.companyName;
  if (newFilters.status) query.status = newFilters.status;
  if (newFilters.priority) query.priority = newFilters.priority;
  if (newFilters.remoteType) query.remoteType = newFilters.remoteType;

  router.replace({ query });
}, { deep: true });

watch(() => route.query, (newQuery) => {
  filters.value.jobTitle = (newQuery.jobTitle as string) || '';
  filters.value.companyName = (newQuery.companyName as string) || '';
  filters.value.status = (newQuery.status as string) || null;
  filters.value.priority = (newQuery.priority as string) || null;
  filters.value.remoteType = (newQuery.remoteType as string) || null;
});

const filteredApplications = computed(() => {
  let result = applications.value;

  if (filters.value.jobTitle) {
    const search = filters.value.jobTitle.toLowerCase();
    result = result.filter(a => a.jobTitle.toLowerCase().includes(search));
  }

  if (filters.value.companyName) {
    const search = filters.value.companyName.toLowerCase();
    result = result.filter(a => a.company.name.toLowerCase().includes(search));
  }

  if (filters.value.status) {
    result = result.filter(a => a.status === filters.value.status);
  }

  if (filters.value.priority) {
    result = result.filter(a => a.priority === filters.value.priority);
  }

  if (filters.value.remoteType) {
    result = result.filter(a => a.remoteType === filters.value.remoteType);
  }

  return result;
});

const tableColumns = [
  { field: 'jobTitle', header: 'Job Title', sortable: true },
  { field: 'company.name', header: 'Company', sortable: true },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'priority', header: 'Priority', sortable: true },
  { field: 'location', header: 'Location', sortable: false },
  { field: 'remoteType', header: 'Remote', sortable: false },
];

const statusOptions = [
  { label: 'Not Started', value: 'NOT_STARTED' },
  { label: 'Applied (No Referral)', value: 'APPLIED_NO_REFERRAL' },
  { label: 'Applied (With Referral)', value: 'APPLIED_WITH_REFERRAL' },
  { label: 'Phone Screen', value: 'PHONE_SCREEN' },
  { label: 'Early Stages', value: 'EARLY_STAGES' },
  { label: 'Final Round', value: 'FINAL_ROUND' },
  { label: 'Offer Received', value: 'OFFER_RECEIVED' },
  { label: 'Offer Accepted', value: 'OFFER_ACCEPTED' },
  { label: 'Offer Declined', value: 'OFFER_DECLINED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
];

const priorityOptions = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

const remoteTypeOptions = [
  { label: 'Onsite', value: 'ONSITE' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'Remote', value: 'REMOTE' },
  { label: 'Flexible', value: 'FLEXIBLE' },
];

const preferenceOptions = [
  { label: 'Strongly Prefer', value: 'STRONGLY_PREFER' },
  { label: 'Prefer', value: 'PREFER' },
  { label: 'Neutral', value: 'NEUTRAL' },
  { label: 'Avoid', value: 'AVOID' },
  { label: 'Dealbreaker', value: 'DEALBREAKER' },
];

const companyOptions = computed(() =>
  companies.value.map(c => ({ label: c.name, value: c.id }))
);

const calculatePriority = (data: {
  postedDate?: string;
  postingEndDate?: string;
  preference: string;
  companyId: string;
}): string => {
  let score = 0;

  if (data.preference === 'STRONGLY_PREFER') score += 3;
  else if (data.preference === 'PREFER') score += 2;
  else if (data.preference === 'NEUTRAL') score += 1;
  else if (data.preference === 'AVOID') score -= 1;
  else if (data.preference === 'DEALBREAKER') score -= 3;

  const company = companies.value.find(c => c.id === data.companyId);
  if (company?.contacts && company.contacts.length > 0) {
    score += 2;
  }

  if (data.postingEndDate) {
    const endDate = new Date(data.postingEndDate);
    const now = new Date();
    const daysUntilEnd = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilEnd <= 3) score += 2;
    else if (daysUntilEnd <= 7) score += 1;
  }

  if (data.postedDate) {
    const posted = new Date(data.postedDate);
    const now = new Date();
    const daysSincePosted = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSincePosted <= 2) score += 1;
  }

  if (score >= 5) return 'HIGH';
  if (score >= 2) return 'MEDIUM';
  return 'LOW';
};

const openCreateDialog = () => {
  editingApplication.value = null;
  formData.value = {
    jobTitle: '',
    companyId: '',
    linkedinUrl: '',
    companyJobUrl: '',
    salaryMin: null,
    salaryMax: null,
    status: 'NOT_STARTED',
    location: '',
    remoteType: null,
    preference: 'NEUTRAL',
    postedDate: '',
    postingEndDate: '',
    appliedDate: '',
    comments: '',
  };
  showDialog.value = true;
};

const openEditDialog = (app: any) => {
  editingApplication.value = app.id;
  formData.value = {
    jobTitle: app.jobTitle,
    companyId: app.company.id,
    linkedinUrl: app.linkedinUrl || '',
    companyJobUrl: app.companyJobUrl || '',
    salaryMin: app.salaryMin,
    salaryMax: app.salaryMax,
    status: app.status,
    location: app.location || '',
    remoteType: app.remoteType,
    preference: app.preference,
    postedDate: app.postedDate || '',
    postingEndDate: app.postingEndDate || '',
    appliedDate: app.appliedDate || '',
    comments: app.comments || '',
  };
  showDialog.value = true;
};

const handleSave = async () => {
  if (!formData.value.jobTitle.trim() || !formData.value.companyId) {
    alert('Job title and company are required');
    return;
  }

  try {
    const priority = calculatePriority({
      postedDate: formData.value.postedDate,
      postingEndDate: formData.value.postingEndDate,
      preference: formData.value.preference,
      companyId: formData.value.companyId,
    });

    const input = {
      jobTitle: formData.value.jobTitle,
      companyId: formData.value.companyId,
      linkedinUrl: formData.value.linkedinUrl || undefined,
      companyJobUrl: formData.value.companyJobUrl || undefined,
      priority,
      salaryMin: formData.value.salaryMin,
      salaryMax: formData.value.salaryMax,
      status: formData.value.status,
      location: formData.value.location || undefined,
      remoteType: formData.value.remoteType,
      preference: formData.value.preference,
      postedDate: formData.value.postedDate || undefined,
      postingEndDate: formData.value.postingEndDate || undefined,
      appliedDate: formData.value.appliedDate || undefined,
      comments: formData.value.comments || undefined,
    };

    if (editingApplication.value) {
      await updateApplication({ id: editingApplication.value, input });
    } else {
      await createApplication({ input });
    }

    showDialog.value = false;
    refetch();
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to save application');
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
</script>

<template>
  <PageLayout title="Applications">
    <template #actions>
      <Button label="Add Application" icon="pi pi-plus" @click="openCreateDialog" />
    </template>

    <div class="filters">
      <div class="filter-field">
        <label>Search by Job Title</label>
        <InputText v-model="filters.jobTitle" placeholder="Type to search..." fluid />
      </div>

      <div class="filter-field">
        <label>Search by Company</label>
        <InputText v-model="filters.companyName" placeholder="Company name..." fluid />
      </div>

      <div class="filter-field">
        <label>Filter by Status</label>
        <Select v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value"
          placeholder="All Statuses" showClear fluid />
      </div>

      <div class="filter-field">
        <label>Filter by Priority</label>
        <Select v-model="filters.priority" :options="priorityOptions" optionLabel="label" optionValue="value"
          placeholder="All Priorities" showClear fluid />
      </div>

      <div class="filter-field">
        <label>Filter by Remote Type</label>
        <Select v-model="filters.remoteType" :options="remoteTypeOptions" optionLabel="label" optionValue="value"
          placeholder="All Types" showClear fluid />
      </div>
    </div>

    <CrudTable :data="filteredApplications" :loading="loading" :error="error" :columns="tableColumns"
      @delete="handleDelete" @edit="openEditDialog">
      <template #cell-company.name="{ data }">
        <router-link :to="`/companies?name=${data.company.name}`" class="company-link">
          {{ data.company.name }}
        </router-link>
      </template>
    </CrudTable>

    <Dialog v-model:visible="showDialog" modal :header="editingApplication ? 'Edit Application' : 'Create Application'"
      :style="{ width: '40rem' }">
      <div class="form">
        <div class="field">
          <label>Job Title *</label>
          <InputText v-model="formData.jobTitle" fluid />
        </div>

        <div class="field">
          <label>Company *</label>
          <Select v-model="formData.companyId" :options="companyOptions" optionLabel="label" optionValue="value"
            placeholder="Select company" fluid />
        </div>

        <div class="field">
          <label>LinkedIn URL</label>
          <InputText v-model="formData.linkedinUrl" fluid />
        </div>

        <div class="field">
          <label>Company Job URL</label>
          <InputText v-model="formData.companyJobUrl" fluid />
        </div>

        <div class="field">
          <label>Status</label>
          <Select v-model="formData.status" :options="statusOptions" optionLabel="label" optionValue="value" fluid />
        </div>

        <div class="field">
          <label>Location</label>
          <InputText v-model="formData.location" fluid />
        </div>

        <div class="field">
          <label>Remote Type</label>
          <Select v-model="formData.remoteType" :options="remoteTypeOptions" optionLabel="label" optionValue="value"
            fluid />
        </div>

        <div class="field">
          <label>Preference</label>
          <Select v-model="formData.preference" :options="preferenceOptions" optionLabel="label" optionValue="value"
            fluid />
        </div>

        <div class="field-row">
          <div class="field">
            <label>Posted Date</label>
            <InputText v-model="formData.postedDate" type="date" fluid />
          </div>
          <div class="field">
            <label>Posting End Date</label>
            <InputText v-model="formData.postingEndDate" type="date" fluid />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Min Salary</label>
            <InputNumber v-model="formData.salaryMin" mode="currency" currency="USD" fluid />
          </div>
          <div class="field">
            <label>Max Salary</label>
            <InputNumber v-model="formData.salaryMax" mode="currency" currency="USD" fluid />
          </div>
        </div>

        <div class="field">
          <label>Comments</label>
          <Textarea v-model="formData.comments" rows="3" fluid />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="showDialog = false" />
        <Button :label="editingApplication ? 'Update' : 'Create'" @click="handleSave" />
      </template>
    </Dialog>
  </PageLayout>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.company-link {
  color: var(--primary-color);
  text-decoration: none;
}

.company-link:hover {
  text-decoration: underline;
}
</style>