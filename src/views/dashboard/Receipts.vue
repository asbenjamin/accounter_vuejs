<template>
    <div class="page-invoices">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link to="/dashboard">Dashboard</router-link></li>
                <li class="is-active"><router-link to="/dashboard/receipts" aria-current="true">Receipts</router-link></li>
            </ul>
        </nav>

        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Receipts</h1>
            </div>

            <div class="column is-12">
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client</th>
                            <th>Amount</th>
                            <th>Due date</th>
                            <th>Is paid</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="receipt in receipts"
                            v-bind:key="receipt.id"
                        >
                            <td>{{ receipt.receipt_number }}</td>
                            <td>{{ receipt.customer_name }}</td>
                            <td>{{ receipt.gross_amount }}</td>
                            <td>{{ receipt.get_due_date_formatted }}</td>
                            <td>{{ getStatusLabel(receipt) }}</td>
                            <td>
                                <router-link :to="{ name: 'Receipt', params: { id: receipt.id }}">Details</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Receipts',
    data() {
        return {
            receipts: []
        }
    },
    mounted() {
        this.getReceipts()
    },
    methods: {
        getReceipts() {
            axios
                .get('/api/v1/receipts/')
                .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.receipts.push(response.data[i])
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error))
                })
        },
        getStatusLabel(receipt) {
            if (receipt.is_paid) {
                return 'Yes'
            } else {
                return 'No'
            }
        }
    }
}
</script>
