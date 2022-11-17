<template>
    <div class="page-add-invoice">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/receipts">Receipts</router-link></li>
                <li class="is-active"><router-link to="/dashboard/receipts/add" aria-current="true">Add</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Add Receipt</h1>
            </div>

            <div class="column is-12">
                <h2 class="is-size-5 mb-4">Customer</h2>

                <div class="select">
                    <select name="customer" v-model="receipt.customer">
                        <option value="">- Select Customer -</option>
                        <option 
                            v-for="customer in customers"
                            v-bind:key="customer.id"
                            v-bind:value="customer"
                        >
                            {{ customer.name }}
                        </option>
                    </select>
                </div>

                <div class="box mt-4" v-if="receipt.customer">
                    <p><strong>{{ receipt.customer.name }}</strong></p>
                    <p><strong>Email:</strong> {{ receipt.customer.email }}</p>
                    <p v-if="receipt.customer.address1">{{ receipt.customer.address1 }}</p>
                    <p v-if="receipt.customer.address2">{{ receipt.customer.address2 }}</p>
                    <p v-if="receipt.customer.zipcode || receipt.customer.place">{{ receipt.customer.zipcode }} {{ receipt.customer.place }}</p>
                    <p v-if="receipt.customer.country">{{ receipt.customer.country }}</p>
                </div>
            </div>

            <div class="column is-12">
                <h2 class="is-size-5 mb-4">Items</h2>

                <ItemForm
                    v-for="item in receipt.items"
                    v-bind:key="item.item_num"
                    v-bind:initialItem="item"
                    v-on:updatePrice="updateTotals"
                >
                </ItemForm>

                <button class="button is-light" @click="addItem">+</button>
            </div>

            <div class="column is-12">
                <h2 class="is-size-5 mb-4">Misc</h2>

                <div class="field">
                    <label>Due days</label>

                    <div class="control">
                        <input type="number" class="input" v-model="receipt.due_days">
                    </div>
                </div>

                <div class="field">
                    <label>Sender reference</label>

                    <div class="control">
                        <input type="text" class="input" v-model="receipt.sender_reference">
                    </div>
                </div>
            </div>
        </div>

        <div class="column is-12">
            <h2 class="is-size-5 mb-4">Total</h2>

            <p><strong>Net amount</strong>: {{ receipt.net_amount }}</p>
            <p><strong>Vat amount</strong>: {{ receipt.vat_amount }}</p>
            <p><strong>Gross amount</strong>: {{ receipt.gross_amount }}</p>
        </div>

        <div class="column is-12">
            <button class="button is-success" @click="submitForm">Save</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

import ItemForm from '@/components/ItemForm.vue'

export default {
    name: 'AddReceipt',
    components: {
        ItemForm
    },
    data() {
        return {
            receipt: {
                customer: '',
                items: [
                    {
                        item_num: 0,
                        title: '',
                        unit_price: '',
                        quantity: 1,
                        vat_rate: 0,
                        net_amount: 0
                    }
                ],
                due_days: 14, 
                net_amount: 0,
                vat_amount: 0,
                gross_amount: 0
            },
            customers: []
        }
    },
    async mounted() {
        await this.getCustomers()
    },
    methods: {
        getCustomers() {
            axios
                .get('/api/v1/customers/')
                .then(response => {
                    this.customers = response.data
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        addItem() {
            this.receipt.items.push({
                item_num: this.receipt.items.length,
                title: '',
                unit_price: '',
                quantity: 1,
                vat_rate: 0,
                net_amount: 0
            })
        },
        updateTotals(changedItem) {
            let net_amount = 0
            let vat_amount = 0

            let item = this.receipt.items.filter(i => i.item_num === changedItem.item_num)

            item = changedItem

            for (let i = 0; i < this.receipt.items.length; i++) {
                const vat_rate = this.receipt.items[i].vat_rate

                vat_amount += this.receipt.items[i].net_amount * (vat_rate / 100)
                net_amount += this.receipt.items[i].net_amount
            }

            this.receipt.net_amount = net_amount
            this.receipt.vat_amount = vat_amount
            this.receipt.gross_amount = net_amount + vat_amount
            this.receipt.discount_amount = 0
        },
        submitForm() {
            this.receipt.customer_name = this.receipt.customer.name
            this.receipt.customer_email = this.receipt.customer.email
            this.receipt.customer_org_number = this.receipt.customer.org_number
            this.receipt.customer_address1 = this.receipt.customer.address1
            this.receipt.customer_address2 = this.receipt.customer.address2
            this.receipt.customer_zipcode = this.receipt.customer.zipcode
            this.receipt.customer_place = this.receipt.customer.place
            this.receipt.customer_country = this.receipt.customer.country
            this.receipt.customer_contact_person = this.receipt.customer.contact_person
            this.receipt.customer_contact_reference = this.receipt.customer.contact_reference
            this.receipt.customer = this.receipt.customer.id

            axios
                .post('/api/v1/receipts/', this.receipt)
                .then(response => {
                    toast({
                        message: 'The receipt was added',
                        type: 'is-success',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })

                    this.$router.push('/dashboard/receipts')
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        }
    }
}
</script>

<style lang="scss">
    .select, .select select {
        width: 100%;
    }
</style>
