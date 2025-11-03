<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import {
    loadReferralSettings,
    saveReferralSettings,
    generateReferralMessage,
} from './utils/referralTemplate'

interface Props {
    visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible'])

const toast = useToast()

const localVisible = ref(props.visible)
const settings = ref(loadReferralSettings())

// Sync with parent
watch(
    () => props.visible,
    (val) => {
        localVisible.value = val
        if (val) {
            // Reload settings when drawer opens
            settings.value = loadReferralSettings()
        }
    }
)

watch(localVisible, (val) => {
    emit('update:visible', val)
})

const handleSave = () => {
    try {
        saveReferralSettings(settings.value)
        toast.add({
            severity: 'success',
            summary: 'Settings Saved',
            detail: 'Your referral template has been saved',
            life: 2500,
        })
        localVisible.value = false
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Save Failed',
            detail: 'Could not save settings',
            life: 3000,
        })
    }
}

const previewMessage = () => {
    return generateReferralMessage({
        contactName: 'John Doe',
        jobTitle: 'Senior Software Engineer',
        companyName: 'Tech Corp',
        jobLink: 'https://example.com/job',
    })
}
</script>

<template>
    <Drawer v-model:visible="localVisible" header="Referral Message Settings" position="right"
        :style="{ width: '35rem' }">
        <div class="settings-content">
            <div class="field">
                <label for="yourName">Your Name</label>
                <InputText id="yourName" v-model="settings.yourName" placeholder="Enter your name" fluid />
            </div>

            <div class="field">
                <label for="yourCompany">Your Company</label>
                <InputText id="yourCompany" v-model="settings.yourCompany" placeholder="Enter your current company"
                    fluid />
            </div>

            <div class="field">
                <label for="template">Message Template</label>
                <Textarea id="template" v-model="settings.template" rows="10" fluid />
                <small class="help-text">
                    Available placeholders: <code>{contactName}</code>,
                    <code>{yourName}</code>, <code>{yourCompany}</code>,
                    <code>{jobTitle}</code>, <code>{companyName}</code>,
                    <code>{jobLink}</code>
                </small>
            </div>

            <div class="preview-section">
                <h4>Preview</h4>
                <div class="preview-box">
                    {{ previewMessage() }}
                </div>
            </div>

            <div class="drawer-actions">
                <Button label="Cancel" text @click="localVisible = false" />
                <Button label="Save Settings" icon="pi pi-check" @click="handleSave" />
            </div>
        </div>
    </Drawer>
</template>

<style scoped>
.settings-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.field label {
    font-weight: 500;
    color: var(--text-primary);
}

.help-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
    margin-top: 0.5rem;
    display: block;
}

.help-text code {
    background: var(--bg-secondary);
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.85em;
}

.preview-section {
    margin-top: 1rem;
}

.preview-section h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
}

.preview-box {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 6px;
    padding: 1rem;
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-wrap: break-word;
}

.drawer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 1rem;
    margin-top: auto;
    border-top: 1px solid var(--border-primary);
}
</style>