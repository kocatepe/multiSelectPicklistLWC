import { LightningElement, track, api } from 'lwc';

export default class MultiSelectPicklist extends LightningElement {
    @track value;
    @track _options = [];
    @track items = [];

    @api label;

    @api // Use this property to assign picklist options
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
    }

    // Use this property to assign initially selected picklist values (nullable).
    // The objects in the initials array should have two fields: label and value.
    // The initials array must be a subset of the options array.
    @api initials;

    connectedCallback() {
        if(!this.initials) { return; }
        this.items = this.initials.map(item => {
            return {
                label: item.label, name: item.value
            };
        });
    }

    handleChange(event) {
        // "Pillarize" selected option:
        const name = event.target.value;
        if(!name) { return; }
        const label = this._options.find(option => option.value === name).label;
        const pill = { label: label, name: name };
        // Add pill into container:
        if(!this.items.some(item => item.name === pill.name)) {
            this.items.push(pill);
        }
        // Send to parent:
        this.selectDispatcher(pill);
    }

    handleItemRemove(event) {
        const index = event.detail.index;
        // Save the pill before removing:
        const pill = this.items[index];
        // Remove from container:
        this.items.splice(index, 1);
        // Send to parent to be removed:
        this.removeDispatcher(pill);
    }

    selectDispatcher(pill) {
        const eventDetail = { label: pill.label, name: pill.name };
        this.dispatchEvent(new CustomEvent('select', { detail: eventDetail }));
    }

    removeDispatcher(pill) {
        const eventDetail = { label: pill.label, name: pill.name };
        this.dispatchEvent(new CustomEvent('remove', { detail: eventDetail }));
    }
}
