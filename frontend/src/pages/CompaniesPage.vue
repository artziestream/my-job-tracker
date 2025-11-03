<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import PageLayout from '../components/PageLayout.vue';
import CrudTable from '../components/CrudTable.vue';
import FilterBar from '../components/FilterBar.vue';
import CompanyForm from '../components/forms/CompanyForm.vue';
import ContactForm from '../components/forms/ContactForm.vue';
import ContactsList from '../components/ContactsList.vue';
import { useQueryParams } from '../composables/useQueryParams';
import { sizeOptions, typeOptions } from '../constants/options';
import {
  COMPANIES_QUERY,
  CREATE_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from '../graphql/companies';
import { CREATE_CONTACT } from '../graphql/contacts';

const { result, loading, error, refetch } = useQuery(COMPANIES_QUERY);
const companies = ref<any[]>([]);

watch(
  result,
  (newResult) => {
    if (newResult?.companies) {
      companies.value = newResult.companies;
    }
  },
  { immediate: true }
);

const { mutate: createCompany } = useMutation(CREATE_COMPANY);
const { mutate: updateCompany } = useMutation(UPDATE_COMPANY);
const { mutate: deleteCompany } = useMutation(DELETE_COMPANY);
const { mutate: createContact } = useMutation(CREATE_CONTACT);

const { filters } = useQueryParams({
  name: '',
  size: null,
  type: null,
});

const showDialog = ref(false);
const showContactDialog = ref(false);
const showContactsListDialog = ref(false);
const editingCompany = ref<any>(null);
const selectedCompanyForContacts = ref<any>(null);

const filteredCompanies = computed(() => {
  let result = companies.value;

  if (filters.value.name) {
    const searchTerm = filters.value.name.toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(searchTerm));
  }

  if (filters.value.size) {
    result = result.filter((c) => c.size === filters.value.size);
  }

  if (filters.value.type) {
    result = result.filter((c) => c.type === filters.value.type);
  }

  return result;
});

const tableColumns = [
  { field: 'name', header: 'Company Name', sortable: true },
  { field: 'size', header: 'Size', sortable: true },
  { field: 'type', header: 'Type', sortable: true },
  { field: 'comments', header: 'Comments', sortable: false },
  { field: 'contacts', header: 'Contacts', sortable: false },
];

const filterFields = [
  {
    key: 'name',
    label: 'Search by Name',
    type: 'text' as const,
    placeholder: 'Type to search...',
  },
  {
    key: 'size',
    label: 'Filter by Size',
    type: 'select' as const,
    placeholder: 'All Sizes',
    options: sizeOptions,
  },
  {
    key: 'type',
    label: 'Filter by Type',
    type: 'select' as const,
    placeholder: 'All Types',
    options: typeOptions,
  },
];

const openCreateDialog = () => {
  editingCompany.value = null;
  showDialog.value = true;
};

const openEditDialog = (company: any) => {
  editingCompany.value = company;
  showDialog.value = true;
};

const handleSaveCompany = async (data: any) => {
  try {
    if (editingCompany.value) {
      await updateCompany({ id: editingCompany.value.id, input: data });
    } else {
      await createCompany({ input: data });
    }
    showDialog.value = false;
    refetch();
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

const handleDelete = async (id: string) => {
  if (confirm('Delete this company?')) {
    try {
      await deleteCompany({ id });
      refetch();
    } catch (err) {
      console.error('Error:', err);
    }
  }
};

const openContactsList = (company: any) => {
  selectedCompanyForContacts.value = company;
  showContactsListDialog.value = true;
};

const openAddContactDialog = (company: any) => {
  selectedCompanyForContacts.value = company;
  showContactDialog.value = true;
};

const handleSaveContact = async (data: any) => {
  try {
    await createContact({ input: data });
    showContactDialog.value = false;
    await refetch();
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};
</script>

<template>
  <PageLayout title="Companies">
    <template #actions>
      <Button label="Add Company" icon="pi pi-plus" @click="openCreateDialog" />
    </template>

    <FilterBar :filters="filters" :fields="filterFields" @update:filters="filters = $event" />

    <CrudTable :data="filteredCompanies" :loading="loading" :error="error" :columns="tableColumns"
      @delete="handleDelete" @edit="openEditDialog">
      <template #cell-contacts="{ data }">
        <Button :label="`${data.contacts.length}`" :severity="data.contacts.length > 0 ? 'info' : 'secondary'" outlined
          size="small" @click="openContactsList(data)" />
      </template>
    </CrudTable>

    <Dialog v-model:visible="showDialog" modal :header="editingCompany ? 'Edit Company' : 'Create Company'"
      :style="{ width: '30rem' }">
      <CompanyForm :initial-data="editingCompany" @save="handleSaveCompany" @cancel="showDialog = false" />
    </Dialog>
    <ContactsList :company="selectedCompanyForContacts" :visible="showContactsListDialog"
      @close="showContactsListDialog = false" @add-contact="openAddContactDialog" @updated="refetch" />
    <Dialog v-model:visible="showContactDialog" modal header="Add Contact" :style="{ width: '30rem' }">
      <ContactForm :company-id="selectedCompanyForContacts?.id" @save="handleSaveContact"
        @cancel="showContactDialog = false" />
    </Dialog>
  </PageLayout>
</template>