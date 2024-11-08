import { LightningElement, track, api } from 'lwc';
// We store our picklist options in Custom Metadata Type records
// and use Apex imperatively to fetch them.
import getRelationshipTypes from '@salesforce/apex/LWCUtility.getRelationshipTypesFromMetadata';

export default class MultiSelectExampleParent extends LightningElement {
    entityId = '';
    @track relationshipTypeOptions = [];
    @track initialSelections = [];
    ownership = 0;

    relationshipsArray = [];
    selectedRelationships = '';

    loading = false;

    connectedCallback() {
        this.loading = true;
        this.loadRelationshipTypeOptions();
    }

    loadRelationshipTypeOptions() {
        getRelationshipTypes()
            .then(result => {
                this.relationshipTypeOptions = result.map(relType => {
                    return {
                        label: relType.Label,
                        value: relType.DeveloperName
                    };
                });
            })
            .catch(error => {
                if(error.body && error.body.message) {
                    this.errorMessage = error.body.message;
                } else {
                    this.errorMessage = 'An unexpected error occured (loadRelationshipTypeOptions.getRelationshipTypes).';
                }
            })
            .finally(() => {
                this.loading = false;
                // "Owner" and "Director" are pre-selected as example.
                // Remove the finally block or leave empty to have no pre-selected values.
                this.initialSelections.push(this.relationshipTypeOptions[7]);
                this.initialSelections.push(this.relationshipTypeOptions[2]);
                this.relationshipsArray = [...this.initialSelections];
            });
    }

    handleEntityId(event) {
        this.entityId = event.target.value;
    }

    handleMultiSelect(event) {
        if(!this.relationshipsArray.some(item => item.value === event.detail.name)) {
            this.relationshipsArray.push({ label: event.detail.label, value: event.detail.name });
        }
    }

    handleMultiRemove(event) {
        const index = this.relationshipsArray.findIndex(item => item.value === event.detail.name);
        if(index !== -1) {
            this.relationshipsArray.splice(index, 1);
        }
    }

    handleOwnership(event) {
        this.ownership = event.target.value;
    }

    handleSave() {
        this.selectedRelationships = '';
        this.relationshipsArray.forEach(obj => {
            this.selectedRelationships += obj.value + ', ';
        });
        this.selectedRelationships = this.selectedRelationships.slice(0, -2);
    }
}