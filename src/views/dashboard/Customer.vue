<template>
    <div class="page-client">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li><router-link to="/dashboard/customers">Customers</router-link></li>
                <li class="is-active"><router-link :to="{ name: 'Customer', params: { id: customer.id }}" aria-current="true">{{ customer.name }}</router-link></li>
            </ul>
        </nav>
        
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">{{ customer.name }}</h1>

                <router-link :to="{ name: 'EditCustomer', params: { id: customer.id }}" class="button is-light mt-4">Edit</router-link>
            </div>

            <div class="column is-12">
                <h2 class="subtitle">Contact details</h2>

                <p><strong>{{ customer.name }}</strong></p>
                
                <p v-if="customer.address1">{{ customer.address1 }}</p>
                <p v-if="customer.address2">{{ customer.address2 }}</p>
                <p v-if="customer.zipcode || customer.place">{{ customer.zipcode }} {{ customer.place }}</p>
                <p v-if="customer.country">{{ customer.country }}</p>
            </div>

            <div class="column is-12" v-if="unpaidReceipts.length">
                <div class="box">
                    <h2 class="subtitle">Unpaid Receipts</h2>

                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Amount</th>
                                <th>Due date</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="receipt in unpaidReceipts"
                                v-bind:key="receipt.id"
                            >
                                <td>{{ receipt.receipt_number }}</td>
                                <td>{{ receipt.gross_amount }}</td>
                                <td>{{ receipt.get_due_date_formatted }}</td>
                                <td>
                                    <router-link :to="{ name: 'Receipt', params: { id: receipt.id } }">Details</router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="column is-12" v-if="paidReceipts.length">
                <div class="box">
                    <h2 class="subtitle">Paid Receipts</h2>

                    <table class="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Amount</th>
                                <th>Due date</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="receipt in paidReceipts"
                                v-bind:key="receipt.id"
                            >
                                <td>{{ receipt.receipt_number }}</td>
                                <td>{{ receipt.gross_amount }}</td>
                                <td>{{ receipt.get_due_date_formatted }}</td>
                                <td>
                                    <router-link :to="{ name: 'Receipt', params: { id: receipt.id } }">Details</router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Customer',
    data () {
        return {
            customer: {
                receipts: []
            }
        }
    },
    mounted() {
        this.getCustomer()
    },
    methods: {
        getCustomer() {
            const customerID = this.$route.params.id

            axios
                .get(`/api/v1/customers/${customerID}`)
                .then(response => {
                    this.customer = response.data
                })
                .catch(error => {
                })
        }
    },
    computed: {
        unpaidReceipts() {
            return this.customer.receipts.filter(receipt => receipt.is_paid === false)
        },
        paidReceipts() {
            return this.customer.receipts.filter(receipt => receipt.is_paid === true)
        }
    }
}
</script>
