<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import PageLayout from '../components/PageLayout.vue';
import CrudTable from '../components/CrudTable.vue';

const router = useRouter();
const route = useRoute();

const COMPANIES_QUERY = gql`
  query GetCompanies {
    companies {
      id
      name
      size
      type
      comments
      contacts {
        id
        name
        title
        email
        phone
        linkedinProfile
        seniority
        contactStatus
      }
    }
  }
`;

const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      size
      type
      comments
    }
  }
`;

const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      size
      type
      comments
    }
  }
`;

const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
    }
  }
`;

const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      name
      title
      email
      phone
      linkedinProfile
      contactStatus
    }
  }
`;

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

const showDialog = ref(false);
const editingCompany = ref<string | null>(null);
const formData = ref({
  name: '',
  size: null as string | null,
  type: null as string | null,
  comments: '',
});

const showContactDialog = ref(false);
const showContactsListDialog = ref(false);
const selectedCompanyForContacts = ref<any | null>(null);

const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  title: '',
  linkedinProfile: '',
  seniority: null as string | null,
  contactStatus: 'TO_REACH_OUT' as string,
  referredBy: '',
  notes: '',
  companyId: '',
});

const filters = ref({
  name: (route.query.name as string) || '',
  size: (route.query.size as string) || null,
  type: (route.query.type as string) || null,
});

watch(filters, (newFilters) => {
  const query: any = {};
  if (newFilters.name) query.name = newFilters.name;
  if (newFilters.size) query.size = newFilters.size;
  if (newFilters.type) query.type = newFilters.type;

  router.replace({ query });
}, { deep: true });

watch(() => route.query, (newQuery) => {
  filters.value.name = (newQuery.name as string) || '';
  filters.value.size = (newQuery.size as string) || null;
  filters.value.type = (newQuery.type as string) || null;
});

const filteredCompanies = computed(() => {
  let result = companies.value;

  if (filters.value.name) {
    const searchTerm = filters.value.name.toLowerCase();
    result = result.filter((c) =>
      c.name.toLowerCase().includes(searchTerm)
    );
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

const sizeOptions = [
  { label: 'Small', value: 'SMALL' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Large', value: 'LARGE' },
  { label: 'Enterprise', value: 'ENTERPRISE' },
];

const typeOptions = [
  { label: 'Startup', value: 'STARTUP' },
  { label: 'Private', value: 'PRIVATE' },
  { label: 'Public', value: 'PUBLIC' },
  { label: 'Nonprofit', value: 'NONPROFIT' },
];

const seniorityOptions = [
  { label: 'Entry', value: 'ENTRY' },
  { label: 'Mid', value: 'MID' },
  { label: 'Senior', value: 'SENIOR' },
  { label: 'Principal', value: 'PRINCIPAL' },
  { label: 'VP', value: 'VP' },
];

const contactStatusOptions = [
  { label: 'To Reach Out', value: 'TO_REACH_OUT' },
  { label: 'Reached Out', value: 'REACHED_OUT' },
  { label: 'Responded', value: 'RESPONDED' },
  { label: 'Connected', value: 'CONNECTED' },
  { label: 'Meeting Scheduled', value: 'MEETING_SCHEDULED' },
  { label: 'No Response', value: 'NO_RESPONSE' },
  { label: 'Not Interested', value: 'NOT_INTERESTED' },
];

const openCreateDialog = () => {
  editingCompany.value = null;
  formData.value = { name: '', size: null, type: null, comments: '' };
  showDialog.value = true;
};

const openEditDialog = (company: any) => {
  editingCompany.value = company.id;
  formData.value = {
    name: company.name,
    size: company.size,
    type: company.type,
    comments: company.comments || '',
  };
  showDialog.value = true;
};

const handleSave = async () => {
  if (!formData.value.name.trim()) {
    alert('Company name is required');
    return;
  }

  try {
    if (editingCompany.value) {
      await updateCompany({
        id: editingCompany.value,
        input: {
          name: formData.value.name,
          size: formData.value.size,
          type: formData.value.type,
          comments: formData.value.comments || undefined,
        },
      });
    } else {
      await createCompany({
        input: {
          name: formData.value.name,
          size: formData.value.size,
          type: formData.value.type,
          comments: formData.value.comments || undefined,
        },
      });
    }

    showDialog.value = false;
    refetch();
  } catch (err) {
    console.error('Error:', err);
    alert(`Failed to ${editingCompany.value ? 'update' : 'create'} company`);
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
  contactForm.value = {
    name: '',
    email: '',
    phone: '',
    title: '',
    linkedinProfile: '',
    seniority: null,
    contactStatus: 'TO_REACH_OUT',
    referredBy: '',
    notes: '',
    companyId: company.id,
  };
  showContactDialog.value = true;
};

const handleSaveContact = async () => {
  if (!contactForm.value.name.trim()) {
    alert('Contact name is required');
    return;
  }
  try {
    await createContact({ input: contactForm.value });
    showContactDialog.value = false;
    await refetch();
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to create contact');
  }
};
</script>

<template>
  <PageLayout title="Companies">
    <template #actions>
      <Button label="Add Company" icon="pi pi-plus" @click="openCreateDialog" />
    </template>

    <div class="filters">
      <div class="filter-field">
        <label>Search by Name</label>
        <InputText v-model="filters.name" placeholder="Type to search..." fluid />
      </div>

      <div class="filter-field">
        <label>Filter by Size</label>
        <Select v-model="filters.size" :options="sizeOptions" optionLabel="label" optionValue="value"
          placeholder="All Sizes" showClear fluid />
      </div>

      <div class="filter-field">
        <label>Filter by Type</label>
        <Select v-model="filters.type" :options="typeOptions" optionLabel="label" optionValue="value"
          placeholder="All Types" showClear fluid />
      </div>
    </div>

    <CrudTable :data="filteredCompanies" :loading="loading" :error="error" :columns="tableColumns"
      @delete="handleDelete" @edit="openEditDialog">
      <template #cell-contacts="{ data }">
        <Button :label="`${data.contacts.length}`" :severity="data.contacts.length > 0 ? 'info' : 'secondary'" outlined
          size="small" @click="openContactsList(data)" />
      </template>
    </CrudTable>

    <Dialog v-model:visible="showDialog" modal :header="editingCompany ? 'Edit Company' : 'Create Company'"
      :style="{ width: '30rem' }">
      <div class="form">
        <div class="field">
          <label>Company Name *</label>
          <InputText v-model="formData.name" placeholder="Enter name" fluid />
        </div>

        <div class="field">
          <label>Size</label>
          <Select v-model="formData.size" :options="sizeOptions" optionLabel="label" optionValue="value"
            placeholder="Select size" fluid />
        </div>

        <div class="field">
          <label>Type</label>
          <Select v-model="formData.type" :options="typeOptions" optionLabel="label" optionValue="value"
            placeholder="Select type" fluid />
        </div>

        <div class="field">
          <label>Comments</label>
          <Textarea v-model="formData.comments" rows="3" fluid />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="showDialog = false" />
        <Button :label="editingCompany ? 'Update' : 'Create'" @click="handleSave" />
      </template>
    </Dialog>

    <Dialog v-model:visible="showContactsListDialog" modal
      :header="`Contacts for ${selectedCompanyForContacts?.name || ''}`" :style="{ width: '50rem' }">
      <div v-if="
        !selectedCompanyForContacts?.contacts ||
        selectedCompanyForContacts.contacts.length === 0
      " class="empty-message">
        <p>No contacts found for this company.</p>
      </div>

      <div v-else>
        <table class="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Email</th>
              <th>Phone</th>
              <th>LinkedIn</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in selectedCompanyForContacts.contacts" :key="c.id">
              <td>{{ c.name }}</td>
              <td>{{ c.title || '-' }}</td>
              <td>{{ c.email || '-' }}</td>
              <td>{{ c.phone || '-' }}</td>
              <td>
                <a v-if="c.linkedinProfile" :href="c.linkedinProfile" target="_blank" rel="noopener noreferrer"
                  class="linkedin-link">
                  <i class="pi pi-linkedin"></i> View
                </a>
                <span v-else>-</span>
              </td>
              <td>{{ c.contactStatus }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <Button label="Add Contact" icon="pi pi-plus" @click="openAddContactDialog(selectedCompanyForContacts)" />
        <Button label="Close" text @click="showContactsListDialog = false" />
      </template>
    </Dialog>

    <Dialog v-model:visible="showContactDialog" modal header="Add Contact" :style="{ width: '30rem' }">
      <div class="form">
        <div class="field">
          <label>Name *</label>
          <InputText v-model="contactForm.name" placeholder="Enter name" fluid />
        </div>

        <div class="field">
          <label>Title</label>
          <InputText v-model="contactForm.title" placeholder="e.g. Software Engineer" fluid />
        </div>

        <div class="field">
          <label>Email</label>
          <InputText v-model="contactForm.email" type="email" placeholder="email@example.com" fluid />
        </div>

        <div class="field">
          <label>Phone</label>
          <InputText v-model="contactForm.phone" placeholder="(123) 456-7890" fluid />
        </div>

        <div class="field">
          <label>LinkedIn Profile</label>
          <InputText v-model="contactForm.linkedinProfile" placeholder="https://linkedin.com/in/..." fluid />
        </div>

        <div class="field">
          <label>Seniority</label>
          <Select v-model="contactForm.seniority" :options="seniorityOptions" optionLabel="label" optionValue="value"
            placeholder="Select seniority" fluid />
        </div>

        <div class="field">
          <label>Status</label>
          <Select v-model="contactForm.contactStatus" :options="contactStatusOptions" optionLabel="label"
            optionValue="value" placeholder="Select status" fluid />
        </div>

        <div class="field">
          <label>Referred By</label>
          <InputText v-model="contactForm.referredBy" placeholder="Who referred you?" fluid />
        </div>

        <div class="field">
          <label>Notes</label>
          <Textarea v-model="contactForm.notes" rows="3" placeholder="Additional notes..." fluid />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="showContactDialog = false" />
        <Button label="Create" @click="handleSaveContact" />
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

.filter-field label {
  color: var(--text-primary);
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

.field label {
  color: var(--text-primary);
}

.empty-message {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.contacts-table {
  width: 100%;
  border-collapse: collapse;
}

.contacts-table th,
.contacts-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-primary);
  text-align: left;
}

.contacts-table th {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contacts-table td {
  color: var(--text-primary);
}

.contacts-table tbody tr:hover {
  background: var(--bg-secondary);
}

.linkedin-link {
  color: var(--primary-color);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: opacity 0.2s;
}

.linkedin-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.linkedin-link i {
  font-size: 1rem;
}
</style>